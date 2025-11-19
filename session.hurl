# Health Check
GET {{host}}/api/health
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.service" == "ms-user"

# Get Users
GET {{host}}/api/users
HTTP 200
[Asserts]
jsonpath "$" isCollection

# API Docs
GET {{host}}/api-docs
HTTP 200