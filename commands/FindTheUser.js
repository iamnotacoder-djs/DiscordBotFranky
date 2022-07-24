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
        defaultPermission: true,
		nameLocalizations: {
			"ru": "информатор",
			"uk": "інформатор",
			"en-US": "informant",
			"en-GB": "informant"
		},
		descriptionLocalizations: {
			"ru": "Разузнать о ком-либо по его ID",
			"uk": "Дізнатися про будь-кого за його ID",
			"en-US": "Find out about someone by their ID",
			"en-GB": "Find out about someone by their ID"
		}
    };
    componentsNames = [];

    constructor() {
        super();
    }

	badges = {
		HYPESQUAD_EVENTS: '`Hypesquad Events` <:b1:1000165753372299354>',
		HOUSE_BRILLIANCE: '`HypeSquad Brilliance House` <:b2:1000165754571853854>',
		HOUSE_BRAVERY: '`HypeSquad Bravery House` <:b3:1000165755809169488>',
		HOUSE_BALANCE: '`HypeSquad Balance House` <:b4:1000165757323329546>',
		BUGHUNTER_LEVEL_1: '`Normal Bug Hunter` <:b5:1000165758778744882>',
		BUGHUNTER_LEVEL_2: '`Bug Buster` <:b6:1000165760179654706>',
		EARLY_SUPPORTER: '`Early Supporter` <:b7:1000165761949638666>',
		EARLY_VERIFIED_BOT_DEVELOPER: '`Early Verified Bot Developer` <:b9:1000165764503965797>',
		DISCORD_CERTIFIED_MODERATOR: '`Discord Certified Moderators` <:b10:1000165766743719996>',
		PARTNERED_SERVER_OWNER: '`Partnered Server Ownerer` <:b8:1000165763287621642>',
		
		DISCORD_PARTNER: '`Discord Partner` <:b12:1000165769109323787>',
		
		SYSTEM: '`System` <:b12:1000165769109323787>',
		TEAM_USER: '`Team User` <:b12:1000165769109323787>',
		VERIFIED_BOT: '`Verified Bot` <:b12:1000165769109323787>',
		DISCORD_EMPLOYEE: '`Discord Staff` <:b12:1000165769109323787>'
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
				const user = await banInfo.user.fetch({ force: true });
				
				if (user == undefined) {
					guild.bans.remove(user_id).catch(null);
					return command.reply({
						embeds: [
							new MessageEmbed()
								.setTitle(client.user.username)
								.setDescription(`Я ничего не смог узнать об этом человеке <@${user_id}>\nОн вообще существует?`)
						]
					});
				}
				const embed = new MessageEmbed()
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
					.addField('Бот', `\`${user.bot ? "Да": "Нет"}\``, true)
					.addField('Зарегистрирован в Discord', `<t:${~~(user.createdAt/1000)}>`, true)
					.setImage(user.bannerURL({ dynamic: true, size: 1024 }) ?? null)
					.setColor(user.accentColor);
					
				if (user.flags && user.flags.toArray().length != 0) embed.addField('Значки', `${user.flags.toArray().map(flag => this.badges[flag]).join(' ')}`);
				await command.reply({ embeds: [ embed ] });
				guild.bans.remove(user_id).catch(null);
			})
			.catch(() => {
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
