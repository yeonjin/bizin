var event = require('./listener/event');

exports.configure = function(app)
{
    //index page - test용 
    app.get('/', index);
    
    //bizin event
    app.get('/auth/:userId/:userPassword', event.auth);
    app.get('/meetings/:lastId/:requestNumber', event.meetings);
    app.get('/meeting/:meetingId/:userId', event.meeting);
    app.put('/checkin/:meetingId/:userId', event.checkin);
    app.get('/user/collars/:userId', event.collars);
    app.get('/user/profile/:userId/:connectionUserId', event.profile);
    app.post('/user/picture', event.savePicture);
    app.post('/connection', event.connection);
    
    app.get('/test', event.test);
};

index = function(req, res){
    res.render('index', { title: 'Express' });
};