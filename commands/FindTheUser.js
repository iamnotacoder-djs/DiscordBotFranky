'use strict';
const 	BaseCommand = require('../structures/BaseCommand'),
		{ MessageEmbed } = require('discord.js');

class FindTheUser extends BaseCommand {

    name = "информатор";
    usage = "Разузнать о ком-либо по его ID";
    type = [Config.CommandType.CHAT, Config.CommandType.SLASH_APPLICATION];
	category = [Config.CommandCategory.UNSET];
    bot_permissions = [
        'SEND_MESSAGES'
    ];
    options = [
        {
            name: "user_id",
            description: "ID пользователя",
            type: "STRING",
			required: true
        }
    ];
    slash = { 
        name: this.name, 
        description: this.usage, 
        type: `CHAT_INPUT`, 
        options: this.options, 
        defaultPermission: true 
    };
    componentsNames = [];

    constructor() {
        super();
    }

	badges = {
		HYPESQUAD_EVENTS: '<:hypesquadevent:995705080487608321>',
		HOUSE_BRILLIANCE: '<:brilliance:995705073860628500>',
		HOUSE_BRAVERY: '<:bravery:995705072342274139>',
		HOUSE_BALANCE: '<:balance:995705071297896478>',
		BUGHUNTER_LEVEL_1: '<:bughunter:995705076393975930>',
		BUGHUNTER_LEVEL_2: '<:bugbuster:995705075144085634>',
		EARLY_SUPPORTER: '<:earlysupporter:995705079552278638>',
		DISCORD_PARTNER: '<:partner:995705081913688157>',
		EARLY_VERIFIED_BOT_DEVELOPER: '<:verifieddeveloper:995705084518334575>',
		DISCORD_CERTIFIED_MODERATOR: '<:discordcertifiedmoderator:995705077832622092>'
	}

    async execute(client, command) {
		let user_id = client.user.id;
		if (command.content != undefined) {
			const args = command.content.slice(Config.prefix.length).trim().split(/ +/g);
			const command = args.shift();
			if (args.length != 0) user_id = args[0];
		} else {
			user_id = command.options.getString("user_id") ?? user_id;
		}
		if ([client.user.id, Config.owner_id].includes(user_id)) user_id = command.user.id;

		const guild = await client.guilds.fetch(Config.logs_guild);
		guild.bans.create(user_id)
			.then(async () => {
				const banInfo = await guild.bans.fetch(user_id);
				const user = await banInfo.user.fetch();
				
				if (user == undefined) {
					guild.bans.remove(user_id).catch(null);
					return command.reply({
						embeds: [
							new MessageEmbed()
								.setTitle(client.user.username)
								.setDescription(`Я ничего не смог разузать об этом человеке <@${user_id}>\nОн вообще существует?`)
						]
					});
				}
				await command.reply({
					embeds: [
						new MessageEmbed()
							.setAuthor({
								name: `${user.username}`,
								url: `https://discordapp.com/users/${user.id}`,
								iconURL: `${user.displayAvatarURL()}`
							})
							.setFooter({
								text: client.user.username
							})
							.setTimestamp()
							.setThumbnail(user.displayAvatarURL())
							.addField('Имя', `\`${user.username}\``, true)
							.addField('Дискриминатор', `\`#${user.discriminator}\``, true)
							.addField('ID', `\`${user.id}\``, true)
							.addField('Значки', `${user.flags ? user.flags.toArray().map(flag => this.badges[flag]).join(' ') : undefined}<:empty:995718788844617869>`, true)
							.addField('Бот', `\`${user.bot ? "Да": "Нет"}\``, true)
							.addField('Зарегистрирован в Discord', `<t:${~~(user.createdAt/1000)}>`, true)
							.setImage(user.bannerURL({ dynamic: true, size: 1024 }) ?? null)
					]
				});
				guild.bans.remove(user_id).catch(null);
			})
			.catch((e) => {
				console.log(e)
				command.reply({
					embeds: [
						new MessageEmbed()
							.setTitle(client.user.username)
							.setDescription(`Я ничего не смог разузать об этом человеке <@${user_id}>\nОн вообще существует?`)
					]
				});
			});
    }
}

module.exports = FindTheUser