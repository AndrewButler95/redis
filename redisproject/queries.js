var redis = require("redis"),
    client = redis.createClient();

client.on("error", function(err) {
    console.log("Error " + err);
});



var id;
client.get('lastid', function(error, value) {
    id = value;
});


// add query functions

module.exports = {
    getAllCurrencies: getAllCurrencies,
    getSingleCurrency: getSingleCurrency,
    createCurrency: createCurrency,
    updateCurrency: updateCurrency,
    removeCurrency: removeCurrency
};

function getAllCurrencies(req, res, next) {
    client.smembers('listofkeys', function(error, data) {
        client.mget(data, function(error, data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ALL cryptocurrency'

                });

        });

    })
}


function getSingleCurrency(req, res, next) {
    console.log(req.params);
    var input = req.params.id;
    client.get(input, function(error, value) {
        console.log("request: " + req + " error: " + error + " value: " + value)
        res.status(200)
            .json({
                status: 'success',
                data: value,
                message: 'Retrieved one currency'
            });
    });
}

function createCurrency(req, res, next) {
    id++;
    client.multi()
        .set('lastid', id)
        .set(id, JSON.stringify(req.body))
        .sadd('listofkeys', id)
        .exec(function(error, replies) {
            console.log("id: " + id + "request: " + JSON.stringify(req.body) + "error: " + error);
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Inserted one currency'
                });

        });
}
/*
example input to curl
 curl -X POST -H "Content-Type: application/json" --data '{"name":"andy","symbol":"A","amount":"1500"}' \http://127.0.0.1:8080/api/cryptocurrency/2
*/
function updateCurrency(req, res, next) {

    client.set(req.params.id, JSON.stringify(req.body), function(error, value) {
        console.log("request: " + JSON.stringify(req.body) + " error: " + error + " value: " + value + "id " + req.params.id)
        res.status(200)
            .json({
                status: 'success',
                data: value,
                message: 'Updated cryptocurrency'
            });
    });


}

function removeCurrency(req, res, next) {
    client.multi()
        .del(req.params.id)
        .srem('listofkeys', req.params.id)
        .exec(function(error, replies) {
            console.log("id: " + req.params.id + "error: " + error);
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Removed currency'
                });
        })
}
