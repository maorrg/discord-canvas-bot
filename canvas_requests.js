//docs: https://canvas.instructure.com/doc/api/discussion_topics.html
require('dotenv').config()
const axios = require('axios')
const { CANVAS_BASE_URI, CANVAS_ANNOUNCEMENTS_URI, CANVAS_COURSES_IDS } = require('./constants');
const { save_register, find_discussion_topic_id, delete_register, message_id_exist} = require('./db.js')


const config = {
    headers: { Authorization: `Bearer ${process.env.CANVAS_TOKEN}` }
};

const create_parameters = (p_title, p_message) => {
    return bodyParameters = {
        title: p_title,
        message: p_message
     };
}

const make_announcement = async (course_id, title, message, message_id) => {
    bodyParameters = create_parameters(title, message);
    if (await message_id_exist(course_id, message_id)) return;
    axios.post( 
        `${CANVAS_BASE_URI}/${course_id}/${CANVAS_ANNOUNCEMENTS_URI}`,
        bodyParameters,
        config
    ).then(function (response) {
        discussion_topic_id = response.data.id;
        save_register(course_id, discussion_topic_id, message_id);
    }).catch(console.log);
}

const make_announcement_in_all_courses = (title, message, message_id) => {
    for(const i in CANVAS_COURSES_IDS){
        course_id = CANVAS_COURSES_IDS[i];
        make_announcement(course_id, title, message, message_id);
    }
}

const delete_announcement = async (course_id, message_id) => {
    discussion_topic_id = await find_discussion_topic_id(course_id, message_id);
    await axios.delete( 
        `${CANVAS_BASE_URI}/${course_id}/discussion_topics/${discussion_topic_id}`,
        config
    ).then(function (response) {
    }).catch(console.log);
    delete_register(course_id, discussion_topic_id, message_id);
}

const delete_announcement_from_all_courses = (message_id) => {
    for(const i in CANVAS_COURSES_IDS){
        course_id = CANVAS_COURSES_IDS[i];
        delete_announcement(course_id, message_id);
    }
}

module.exports = {
    make_announcement,
    make_announcement_in_all_courses,
    delete_announcement,
    delete_announcement_from_all_courses
}