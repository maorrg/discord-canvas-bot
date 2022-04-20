//https://discordjs.guide/popular-topics/reactions.html#listening-for-reactions-on-old-messages
require('dotenv').config()
const { Client, Intents } = require('discord.js');
const { DISCORD_CHANNEL_ID } = require('./constants');
const { make_announcement, make_announcement_in_all_courses, delete_announcement, delete_announcement_from_all_courses } = require('./canvas_requests')

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

// Notify progress
client.on('ready', function(e){
    console.log(`Logged in as ${client.user.tag}!`)
})
// Authenticate
client.login(process.env.DISCORD_TOKEN)

function publish_if_canvas_reaction(){
    client.on('messageReactionAdd', async (reaction, user) => {
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message:', error);
                return;
            }
        }
        msg = reaction.message
        if (msg.channel.id === DISCORD_CHANNEL_ID && reaction.emoji.name === "canvas"){
            make_announcement_in_all_courses("[IGNORAR] Anuncio de testing del sistema", msg.content, msg.id);
        }
    });
};

function delete_if_canvas_reaction(){
    client.on('messageReactionRemove', async (reaction, user) => {
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message:', error);
                return;
            }
        }
        msg = reaction.message
        if (msg.channel.id === DISCORD_CHANNEL_ID && reaction.emoji.name === "canvas"){
            delete_announcement_from_all_courses(msg.id);
        }
    });
}


/* function publish_all_channel_messages(){
 client.on("messageCreate", (msg) => {
    if (msg.channel.id === DISCORD_CHANNEL_ID){
        //console.log("Mensaje detectado!");
        try {
            //make_announcement("[IGNORAR] Anuncio de testing del sistema", msg.content);
        } catch (error) {
            console.log(error)
        }
        return;
    }
 }); 
} */

//publish_all_channel_messages();
publish_if_canvas_reaction();
delete_if_canvas_reaction();