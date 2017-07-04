const MongoClient = require('mongodb').MongoClient;
const db  = require('./db');

// Connect to the db
MongoClient.connect(db.url, function (err, db) {
    // // test example
//     db.collection('Persons', function (err, collection) {
//         collection.insert({ id: 1, firstName: 'Steve', lastName: 'Jobs' });
//         collection.insert({ id: 2, firstName: 'Bill', lastName: 'Gates' });
//         collection.insert({ id: 3, firstName: 'James', lastName: 'Bond' });
//       
//         db.collection('Persons').count(function (err, count) {
//             if (err) throw err;
//             console.log('Total Rows: ' + count);
//         });
//     });
// //end test example
    db.collection("acc", function (err, collection) {
        collection.insert({"name": "Ivan" ,"age": 26, "iin": "345678",	"sex": "male"});
        collection.rename("acc");
        collection.insertMany([{"name": "Alex", "age": 34, "iin": "332244", "sex": "male"},
            {"name": "Serg", "age": 23, "iin": "889977", "sex": "male"},
            {"name": "Inna", "age": 34, "iin": "345234", "sex": "female"}
        ]);
        collection.find({"sex": "male"}).toArray(function(err, items) {
            if(err) throw err;
            console.log('1. Выведите на экран только те документы у которых поле sex == male: ', items);
        });
        collection.find({"sex": "male", "age": 34}).toArray(function(err, items) {
            if(err) throw err;
            console.log('2. Выведите на экран только те документы у которых поле sex == male и возраст 34: ', items);
        });
        collection.find({"sex": "male", "age": 34}, {"iin": 1}).toArray(function(err, items) {
            if(err) throw err;
            console.log('3. Повторите предыдущий запрос, но в результате получите неполный документ, а проекцию содержащую только iin: ', items);
        });
        collection.find().limit(2).toArray(function(err, items) {
            if(err) throw err;
            console.log('4. Выведите только 2 любые записи из базы: ', items);
        });
        collection.find().sort({"age": 1}).toArray(function(err, items) {
            if(err) throw err;
            console.log('5. Выведите все записи сортируя их по возрасту ', items);
        });
        collection.find().count(function (err, count) {
            if(err) throw err;
            console.log('6. Число элементов в коллекции ', count)
        });
        // collection.distinct("name").toArray(function(err, items) {
        //     if(err) throw err;
        //     console.log('7. Выведите на экран записи, которые содержат уникальные имена.', items)
        // });
        collection.find({age: {$gt : 28}}).toArray(function(err, items) {
            if(err) throw err;
            console.log('8. Выведите на экран документы, в которых поле age  больше 28. ', items);
        });
        collection.find({age: {$lt : 28}}).toArray(function(err, items) {
            if(err) throw err;
            console.log('9. Выведите на экран документы, в которых поле age  меньше 28. ', items);
        });
        collection.find({sex: {$ne : "male"}}).toArray(function(err, items) {
            if(err) throw err;
            console.log('10. Выведите на экран документы, в поле sex не равно male ', items);
        });
        collection.find({sex: {$eq : "male"}}).toArray(function(err, items) {
            if(err) throw err;
            console.log('11. Выведите на экран документы, поле sex, которых равно male ', items);
        });
        collection.find({$or : [{name: "Ivan"}, {age: 34}]}).toArray(function(err, items) {
            if(err) throw err;
            console.log('12. Выведите на экран документы у которых имя равно Ivan, или возраст равен 34 ', items);
        });

        //13. Обновите запись с именем Inna. Укажите ей возраст 25.
        collection.update({name : "Inna"}, {$set: {age : 25}});

        //14. Обновите в записи Ivan возраст, укажите 29.
        collection.update({name : "Ivan"}, {$set: {age : 29}});
        // 15.  Добавьте произвольную запись, в котором помимо указанных полей содержится поле phone, внутри которого массив с телефонами.
        // collection.insert({"name": "Inga", "age": 24, "iin": "123456", "sex": "female", "phone": [123456789, 987654321]})

        collection.find({phone: {$exists:true}}).toArray(function(err, items) {
            if(err) throw err;
            console.log('16. Выведите на экран записи содержащие поле  phone. ', items);
        });
        collection.find({phone: {$exists:false}}).toArray(function(err, items) {
            if(err) throw err;
            console.log('17. Выведите на экран записи не содержащие поле phone. ', items);
        });

        // collection.findAndModify({query:{}, sort:{"_id" : -1}, remove:true})

        // Используя метод push добавьте в массив с телефонами еще один телефон.
        collection.updateOne({name : "Inga"}, {$push: {phone: 456789123}});

        //Удалите добавленный телефон из массива.
        collection.update({name : "Inga"}, {$pop: {phone: 1}});

        //Удалите все записи кроме Serg.
        collection.remove({name: {$ne : "Serg"}});

    });

});
