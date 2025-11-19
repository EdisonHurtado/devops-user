# Health Check
GET {{host}}/api/health
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.service" == "ms-user"

# API Docs (sigue el redirect)
GET {{host}}/api-docs/
HTTP 200