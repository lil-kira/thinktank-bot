import { Client, VoiceChannel } from 'discord.js';
import { guild_id } from '../config';

export async function initVoiceManager(client: Client) {

    const guild = client.guilds.get(guild_id)
    if (!guild) return


    const voice_role = guild.roles.get("644177706367451163")
    if (!voice_role) return

    guild.members.filter(member => !member.voiceChannel)
        .map(async member => {
            if (member.roles.has(voice_role.id)) {
                member.removeRole(voice_role)
                    .then(() => { })
                    .catch(() => { })
            }
        })
    guild.channels.map(channel => {
        if (((channel): channel is VoiceChannel => channel.type === "voice")(channel)) {
            if (channel.id !== "643846334885003264" && channel.id !== "649484214466641920") {
                channel.members.map(async member => {
                    member.addRole(voice_role)
                        .then(() => { })
                        .catch(() => { })
                })
            }
        }
    })


    client.on("voiceStateUpdate", (oldMember, newMember) => {
        const member = oldMember || newMember

        if (member.guild.id !== guild_id) {
            return;
        }

        const oldChannel = oldMember.voiceChannel
        const newChannel = newMember.voiceChannel

        if (!oldChannel && newChannel) {
            if (newChannel.id !== "643846334885003264" && newChannel.id !== "649484214466641920") {
                //User joined a vc
                newMember.addRole(voice_role).then(() => { })
                    .catch(() => { })
            }
        } else if (!newChannel) {
            //User left vc
            if (newMember.roles.has(voice_role.id)) {
                newMember.removeRole(voice_role).then(() => { })
                    .catch(() => { })
            }
        }
    })
}