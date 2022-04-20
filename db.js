require('dotenv').config()
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Base de Datos conectada :)")
}).catch((err) => {
    console.log(err);
});

const Register = mongoose.model('Register', {
    course_id: {type: String},
    discussion_topic_id: {type: String},
    message_id: {type: String}
});

const save_register = (course_id, discussion_topic_id, message_id) => {
    var new_register = new Register({
        course_id: course_id,
        discussion_topic_id: discussion_topic_id,
        message_id: message_id
    });
    new_register.save(function(err, result){
        if(err) console.log(err);
    });
};

const find_discussion_topic_id = async (course_id, message_id) => {
    var register = await Register.findOne({course_id:course_id, message_id: message_id});
    if (register) return register.discussion_topic_id;
}

const delete_register = async (course_id, discussion_topic_id, message_id) => {
    Register.find({course_id:course_id, discussion_topic_id:discussion_topic_id, message_id:message_id}).remove().exec();
};

const message_id_exist = async (course_id, message_id) => {
    const isExist = await Register.exists({course_id:course_id, message_id: message_id}).count();
    if (isExist) return true;
    return false;
}

module.exports = {
    save_register,
    find_discussion_topic_id,
    delete_register,
    message_id_exist
}