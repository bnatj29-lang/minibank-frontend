#!/usr/bin/env bash

set -euo pipefail

frontend_dir="$(cd "$(dirname "$0")/.." && pwd)"
backend_dir="$frontend_dir/../minibank-backend"
logs_dir="$(mktemp -d "${TMPDIR:-/tmp}/minibank-quick-tunnel.XXXXXX")"

frontend_vite_pid=""
frontend_tunnel_pid=""
backend_pid=""
backend_tunnel_pid=""

limpar() {
    for pid in "$frontend_vite_pid" "$frontend_tunnel_pid" "$backend_pid" "$backend_tunnel_pid"; do
        if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
            kill "$pid" 2>/dev/null || true
        fi
    done
}
trap limpar EXIT INT TERM

liberar_porta() {
    local porta="$1"
    local pids
    pids="$(lsof -tiTCP:"$porta" -sTCP:LISTEN || true)"
    if [ -n "$pids" ]; then
        kill $pids 2>/dev/null || true
    fi
}

for comando in cloudflared npm mvn curl lsof; do
    command -v "$comando" >/dev/null 2>&1 || {
        echo "Comando necessário não encontrado: $comando" >&2
        exit 1
    }
done

for porta in 5173 8080; do
    if lsof -nP -iTCP:"$porta" -sTCP:LISTEN >/dev/null 2>&1; then
        echo "A porta $porta já está em uso. Encerre o processo que a utiliza e execute o script novamente." >&2
        exit 1
    fi
done

if [ -z "${MINIBANK_JWT_SECRET:-}" ]; then
    echo "Defina MINIBANK_JWT_SECRET no ambiente do terminal antes de executar este script." >&2
    exit 1
fi

obter_url_tunel() {
    local arquivo_log="$1"
    local url=""

    for _ in $(seq 1 60); do
        url="$(grep -Eo 'https://[A-Za-z0-9.-]+\.trycloudflare\.com' "$arquivo_log" | head -n 1 || true)"
        if [ -n "$url" ]; then
            printf '%s' "$url"
            return 0
        fi
        sleep 1
    done

    echo "Não foi possível obter a URL do Quick Tunnel. Veja o log: $arquivo_log" >&2
    return 1
}

echo "Iniciando o Vite temporariamente para criar o túnel do frontend..."
(
    cd "$frontend_dir"
    VITE_API_URL="http://localhost:8080" npm run dev >"$logs_dir/vite-inicial.log" 2>&1
) &
frontend_vite_pid=$!

cloudflared tunnel --url http://localhost:5173 >"$logs_dir/frontend-tunnel.log" 2>&1 &
frontend_tunnel_pid=$!
frontend_url="$(obter_url_tunel "$logs_dir/frontend-tunnel.log")"
frontend_host="${frontend_url#https://}"

echo "Frontend: $frontend_url"

kill "$frontend_vite_pid" 2>/dev/null || true
wait "$frontend_vite_pid" 2>/dev/null || true
frontend_vite_pid=""
liberar_porta 5173

echo "Iniciando o backend com o CORS apontado para o frontend..."
(
    cd "$backend_dir"
    FRONTEND_URL="$frontend_url" mvn -q spring-boot:run >"$logs_dir/backend.log" 2>&1
) &
backend_pid=$!

for _ in $(seq 1 60); do
    if curl -sS --max-time 2 http://localhost:8080 >/dev/null 2>&1; then
        break
    fi
    sleep 1
done

if ! curl -sS --max-time 2 http://localhost:8080 >/dev/null 2>&1; then
    echo "O backend não iniciou. Veja o log: $logs_dir/backend.log" >&2
    exit 1
fi

cloudflared tunnel --url http://localhost:8080 >"$logs_dir/backend-tunnel.log" 2>&1 &
backend_tunnel_pid=$!
backend_url="$(obter_url_tunel "$logs_dir/backend-tunnel.log")"

echo "Backend: $backend_url"
echo "Iniciando o frontend com as duas URLs públicas..."
(
    cd "$frontend_dir"
    VITE_API_URL="$backend_url" VITE_ALLOWED_HOST="$frontend_host" npm run dev
)
