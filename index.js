require("dotenv").config();
const { Client, Collection, MessageEmbed } = require("discord.js");
const fs = require("fs");

const prefix = "!";

const id = {
  roles: {
    redTeam: "903745186188910652",
    teamOne: "903746124999954453",
    teamTwo: "903746275084730388",
    teamThree: "903746333578526731",
    teamFour: "903746382412775484",
    teamFive: "903746428092956693",
    teamSix: "903746460447834143",
    teamSeven: "903746496816615454",
    teamEight: "903746529058226226",
    teamNine: "903746559571787796",
    teamTen: "903746591435943966",
    orangeTeam: "903747864855994440",
    whiteTeam: "903747942811320380",
  },
  channels: {
    ticket: "904959531241590785",
  },
  categories: {
    ticket: "904946009963106304",
    selector: "903743840014434366",
  },
};

const roleEmojis = {
  "⚪": id.roles.whiteTeam,
  "🔴": id.roles.redTeam,
  "🟠": id.roles.orangeTeam,
  "1️⃣": id.roles.teamOne,
  "2️⃣": id.roles.teamTwo,  
  "3️⃣": id.roles.teamThree,
  "4️⃣": id.roles.teamFour,
  "5️⃣": id.roles.teamFive,
  "6️⃣": id.roles.teamSix,
  "7️⃣": id.roles.teamSeven,
  "8️⃣": id.roles.teamEight,
  "9️⃣": id.roles.teamNine,
  "🔟": id.roles.teamTen,
};

// Initializes bot with the needed properties of Client
const client = new Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  ws: {
    intents: [
      "GUILDS",
      "GUILD_MESSAGES",
      "GUILD_MEMBERS",
      "GUILD_MESSAGE_REACTIONS",
    ],
  },
});

// Creates new Collection object
client.commands = new Collection();

// Logs in using secret TOKEN
const TOKEN = process.env.TOKEN;
client.login(TOKEN);

// Reads /commands directory and gets each individual file
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

// Makes each file from the /commands directory a command
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Manages ready event
client.on("ready", () => {
  console.info(`Logged in as ${client.user.tag}!`); // Lets me know when bot has logged in
});

// Manages message event
client.on("message", async (msg) => {
  try {
    nitroWorkAround(msg);
    if (
      msg.channel.id === "826676952269717505" &&
      !msg.content.startsWith(prefix) &&
      !msg.author.bot
    ) {
      try {
        const messageArray = msg.content.split(" ");
        msg.channel.send(msg.guild.roles.everyone, {
          disableEveryone: false,
        });
        msg.delete();
        const embed = new MessageEmbed();
        embed.setTitle(messageArray[0]);
        embed.setColor("RED");
        embed.setDescription(messageArray.slice(1).join(" "));
        msg.channel.send(embed);
      } catch (err) {
        console.log(err);
      }
    }
    curseFilter(msg); // Checks for blacklisted words

    if (!msg.content.startsWith(prefix)) return; // only reads messages starting with '!'

    const args = msg.content.slice(prefix.length).split(" "); // Generates an argument array of all words in the command
    const command = args.shift().toLowerCase(); // Makes arguent array into command

    client.commands.get(command)?.execute(client, msg, args); // Executes command if it exists
  } catch (err) {
    console.log(err);
  }
});

// Manages guildMemberAdd event
client.on("guildMemberAdd", async (member) => {
  try {
    console.log("user joined"); // Logs upon event trigger
    const role = member.guild.roles.cache.get(id.roles.outsider);
    await member.roles.add(role); // Gives "Outsider" role upon guild join
    console.log(`Added the role to ${member.displayName}`);
  } catch (err) {
    console.log(err);
  }
});

// Manages messageReactionRemove event
client.on("messageReactionRemove", async (reaction, user) => {
  try {
    // Fetches all reactions from all messages
    const message = !reaction.message.author
      ? await reaction.message.fetch()
      : reaction.message;

    // returns if the reaction is from the bot
    if (message.author.id === user.id) return;
    // returns if the reaction is not in specified channel or category
    // if (reaction.message.channel.parentID != id.categories.selector) return;
    
    if (reaction.emoji.name in roleEmojis) {
      await role(
        "remove",
        reaction.message,
        user,
        roleEmojis[reaction.emoji.name]
      );
    }
  } catch (err) {
    console.log(err);
  }
});

// Manages messageReactionAdd event
client.on("messageReactionAdd", async (reaction, user) => {
  try {
    const message = !reaction.message.author
      ? await reaction.message.fetch()
      : reaction.message;

    // returns if the reaction is from the bot
    if (message.author.id === user.id) return;

    // returns if the reaction is not in specified channel or categorey
    if (![id.categories.ticket, id.categories.selector].includes(reaction.message.channel.parentID)) return;

    // Fetches user who reacted
    const member = await reaction.message.guild.members.fetch(user.id);

    if (reaction.emoji.name === "🎫") {
      let ticketType;
      // Generates channel based on ticketType
      const ticketData = {
        support: {
          parent: id.categories.ticket,
          message:
            "__**Thanks  for contacting the Support Team**__\n\n1) Username ?\n2) Detailed Issue ? \n\n❌ No Valid Proof No Action\n\nTo close ticket react with ❌",
        },
      };

      if (reaction.message.channel.id === id.channels.ticket) {
        ticketType = "support";
      }

      const channel = await reaction.message.guild.channels.create(
        user.username,
        {
          parent: ticketData[ticketType].parent,
          permissionOverwrites: [
            {
              id: reaction.message.guild.id,
              deny: ["VIEW_CHANNEL"],
            },
            {
              id: user.id,
              allow: ["VIEW_CHANNEL"],
            },
          ],
        }
      );
      
      const ticketMsg = await channel.send(ticketData[ticketType].message);
      await ticketMsg.react("❌");
    } else if (reaction.emoji.name in roleEmojis) {
      await uniqueRole(
        "add", 
        reaction.message, 
        user, 
        roleEmojis[reaction.emoji.name]
        );
    } else if (
      reaction.emoji.name === "❌" &&
      reaction.message.member.guild.me.hasPermission("ADMINISTRATOR")
    ) {
      await reaction.message.channel.send(
        "@" + user.tag + " Ticket will close in 5 Seconds..."
      );
      setTimeout(function () {
        reaction.message.channel.delete();
      }, 5000);
    }
    // Deletes reaction if the emoji us not one of the character role emojis
    // if (
    //   reaction.emoji.name != "⚔️" &&
    //   reaction.emoji.name != "🛡" &&
    //   reaction.emoji.name != "👼"
    // )
    //   reaction.users.remove(user.id);
  } catch (err) {
    console.log(err);
  }
});

// role() - ADDS or REMOVES given role to/from a specific user
async function role(action, msg, user, role) {
  try {
    const member = await msg.guild.members.fetch(user.id);
    if (action === "remove") {
      let type = await msg.guild.roles.cache.get(role);
      await member.roles.remove(type);
    } else if (action === "add") {
      let type = await msg.guild.roles.cache.get(role);
      await member.roles.add(type);
    }
  } catch (err) {
    console.log(err);
  }
}

/* curseFilter() - Utilizes a constant Filter array to filter
out any racist or homophobic words i do not want present in my discord
*/
async function curseFilter(msg) {
  // List of blacklisted words
  const Filter = [
    "nigger",
    "n1gger",
    "n1gg3r",
    "ⓝⓘⓖⓖⓔⓡ",
    "n1663r",
    "n166er",
    "ⓝⓘⓖⓖⓐ",
    "n1663a",
    "n1664",
    "nigga",
    "n1gga",
    "n1gg4",
    "nigg4",
    "n1gg4",
    "n1gg4",
    "f4g",
    "fag",
    "faggot",
    "fagg0t",
    "f4gg0t",
    "f4ggot",
    "c00n",
    "coon",
    "spic",
    "wetback",
    "chink",
    "blackie",
    "beaner",
    "n i g g e r",
    "f a g",
    "f a g g o t",
    "n i g",
    "nig",
    "n i g l e t",
  ];

  // If some of the users message "word" is in the array then delete their message and send the warning
  if (Filter.some((word) => msg.content.toLowerCase().includes(word))) {
    try {
      await msg.delete();
      const warning = await msg.channel.send(
        "That type of language is prohibated in this guild"
      );
      setTimeout(async function () {
        await warning.delete();
      }, 10000);
    } catch (err) {
      console.log(err);
    }
  }
}

async function uniqueRole(action, msg, user, roleID) {
  let roles = [id.roles.whiteTeam, id.roles.redTeam, id.roles.orangeTeam, id.roles.teamOne, id.roles.teamTwo, 
    id.roles.teamThree, id.roles.teamFour, id.roles.teamFive, id.roles.teamSix, id.roles.teamSeven, 
    id.roles.teamEight, id.roles.teamNine, id.roles.teamTen]
  
  roles.splice(roles.indexOf(roleID), 1)
  
  const member = await msg.guild.members.fetch(user.id);

  let hasNoRole = true;
  roles.forEach(r => {
    if(member.roles.cache.has(r)) {
      hasNoRole = false
    }
  });

  if(hasNoRole) {
    await role("add", msg, user, roleID);
  }
}

// Sends animated emojis even if user does not have nitro
async function nitroWorkAround(msg) {
  try {
    if (!msg.author.bot) {
      // Array of verified server animated emojis
      const Emojis = [
        "<a:ficlapping:828363090038095894>",
        "<a:fihappiness:828363095674978395>",
        "<a:fisaddness:828363095332225064>",
        "<a:nikclapping:828363093254996019>",
        "<a:nikhappiness:828363095977623572>",
        "<a:niksadness:828363095935418408>",
        "<a:fidealingwithit:828363095566712842>",
        "<a:fihyped:828363095847731282>",
        "<a:fiwinking:828363093734195272>",
        "<a:nikdealingwithit:828363096053514320>",
        "<a:nikhyped:828325536404209744>",
        "<a:nikwinking:828363095016865822>",
        "<a:fifacepalming:828363096028479499>",
        "<a:filoving:828363093423816757>",
        "<a:flamingphionex:828363096200052766>",
        "<a:nikfacepalming:828363096430346250>",
        "<a:nikloving:828363095768170536>",
      ];
      let isEmoji = false;
      let messageArray = await msg.content.split(" ");
      for (let i = 0; i < messageArray.length; i++) {
        for (const emoji of Emojis) {
          let startPos = emoji.indexOf(":") + 1;
          let endPos = emoji.indexOf(":", startPos);
          let getText = emoji.substring(startPos, endPos);
          if (
            messageArray[i].toLowerCase() === getText ||
            messageArray[i].toLowerCase() === ":" + getText + ":"
          ) {
            messageArray[i] = emoji;
            isEmoji = true;
            continue;
          }
        }
      }
      if (isEmoji) {
        msg.channel.send(
          "***" + msg.member.displayName + "***\n" + messageArray.join(" ")
        );
        msg.delete();
      }
    }
  } catch (err) {
    console.log(err);
  }
}
