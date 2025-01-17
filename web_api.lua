-- Test API endpoints
RegisterServerCallback('web/test/endpoints', function(req, res)
    local tests = {
        auth = ValidateAuthToken(req.headers.authorization),
        cors = CheckCORSPolicy(req.headers.origin),
        database = TestDatabaseConnection()
    }
    res.send(tests)
end)
