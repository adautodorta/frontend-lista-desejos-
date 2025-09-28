if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

newman run postman/collection.json \
  -e postman/environment.json \
  --env-var baseUrl="$VITE_SUPABASE_URL" \
  --env-var anonKey="$VITE_SUPABASE_ANON_KEY" \
  --reporters cli,json \
  --reporter-json-export test-results.json
