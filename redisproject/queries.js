var redis = require("redis"),
    client = redis.createClient();

client.on("error", function(err) {
    console.log("Error " + err);
});

var id = 0;

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
    client.set(id, JSON.stringify(req.body), function(error) {
        console.log("id: " + id + "request: " + JSON.stringify(req.body) + "error: " + error);
        res.status(200)
            .json({
                status: 'success',
                message: 'Inserted one currency'
            });
    })
    client.sadd('listofkeys', id);
    id++;


}
/*
example input to curl
 curl -X POST -H "Content-Type: application/json" --data '{"name":"andy","symbol":"A","amount":"1500"}' \http://127.0.0.1:8080/api/cryptocurrency/2
*/
function updateCurrency(req, res, next) {
    // console.log(req.body)
    // var args = [Object.keys(req.body).length*2];
    // for (var i = 0; i < Object.keys(req.body).length; i++) {
    //     args[i*2] = Object.keys(req.body)[i];

    //     var key = args[i];
    //     console.log(req.body[key] + " " + i);
    //   args[(i*2)+1] = req.body[key];
    // }
    // console.log(args);

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

    client.del(req.params.id, function(error, value) {
        console.log("id: " + req.params.id + "error: " + error);
        res.status(200)
            .json({
                status: 'success',
                message: 'Removed ${result.rowCount} currency'
            });
    })
    id--;
}
