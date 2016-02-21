var settings =
        {
            channels : ["#thabeast721"],
            server : "irc.twitch.tv",
            port: 6667,
            secure: false,
            nick : "Super_Happy_Bot",
            password : "oauth:r4tbb19ogfip1r8qrkq227nsg1cxfa"
        };

var options = 
    {
        host: "warp.world"
    };

var irc = require("irc");
var http = require("http");

var botCommands =
[
    { pattern: /!add ([a-z0-9]{4}-){3}[a-z0-9]{4}/i, command: add },
    { pattern: /!close/i, command: close },
    { pattern: /!completed/i, command: completed },
    { pattern: /!current/i, command: current },
    { pattern: /!list/i, command: list },
    { pattern: /!next/i, command: next },
    { pattern: /!open/i, command: open },
    { pattern: /!queue/i, command: queue },
    { pattern: /!remove ([a-z0-9]{4}-){3}[a-z0-9]{4}/i, command: remove },
    { pattern: /!skip/i, command: skip },
    { pattern: /!stats/i, command: stats },
    { pattern: /!submit( ([a-z0-9]{4}-){3}[a-z0-9]{4})?/i, command: submit },
    { pattern: /!initiaterage "[a-z0-9]+" "[a-z0-9]+"/i, command: initiateRage },
];

function UserRage(username, answer)
    {
        this.username = name;
        this.answer = answer;
    }

var listOfUserRage = [];

var bot = new irc.Client(settings.server, settings.nick,
    {
        channels: [settings.channels + " " + settings.password],
        debug: false,
        password: settings.password,
        username: settings.nick
    });

bot.addListener("join", function(channel, who)
    {
        console.log("joined " + channel);
    });

bot.addListener("message", matchMessageToCommand);

function matchMessageToCommand(from, to, message)
{
    for (var i = 0; i < botCommands.length; i++)
    {
        if (message.match(botCommands[i].pattern) != null)
        {
            botCommands[i].command(from, to, message);
        }
    }
}

function makeHTTPCall()
{
    http.get(options, function(resp)
    {
        resp.setEncoding("utf8");
        resp.on("data", function(chunk)
        {
            bot.say(settings.channels, chunk);
        } );
    } );
};

function initiateRage(from, to, message)
{
    listOfUserRage = [];
    var messageCopy = message;
    var firstWord = messageCopy.substring(15, message.indexOf("\""));
    messageCopy = messageCopy.substring(messageCopy.indexOf("\"") + 3);
    var secondWord = messageCopy.substring(0, messageCopy.indexOf("\""));
    var postToServer = setInterval(trackRage(firstWord, secondWord, listOfUserRage), 5000);
    if (message.match(/!stoprage/i) != null)
    {
        clearInterval(postToServer);
    }
}

function trackRage(firstWord, secondWord, listOfUserRage)
{
    bot.addListener("message", function(from, to, message)
    {
        var answer = 0;
        var alreadyEntered = false;
        if (message === firstWord)
        {
            answer = 1;
        }
        else if (message === secondWord)
        {
            answer = 2;
        }
        if (answer != 0)
        {
            
            currentUserRage = new UserRage(from, answer);
            if (!listOfUserRage.contains(currentUserRage))
            {
                listOfUserRage.push(currentUserRage);
            }
        }
    } );
    //post info to server here. need to figure out how to do this
}

function add(from, to, message)
{
    var streamerName = to.substring(1);
    var levelCode = message.substring(5);
    options.path = "/bot/add?streamer=" + streamerName + "&key=bba3e1c6fbe8e202&submitter=" + from + "&levelcode=" + levelCode;
    makeHTTPCall();
}

function close(from, to, message)
{
    var streamerName = to.substring(1);
    options.path = "/bot/close?streamer=" + streamerName + "&key=bba3e1c6fbe8e202";
    makeHTTPCall();
}

function completed(from, to, message)
{
    var streamerName = to.substring(1);
    options.path = "/bot/complete?streamer=" + streamerName + "&key=bba3e1c6fbe8e202";
    makeHTTPCall();
}

function current(from, to, message)
{
    console.log(from);
    var streamerName = to.substring(1);
    options.path = "/bot/current?streamer=" + streamerName + "&submitter=" + from;
    makeHTTPCall();
}

function list(from, to, message)
{
    var streamerName = to.substring(1);
    options.path = "/bot/list?streamer=" + streamerName + "&submitter=" + from;
    makeHTTPCall();
}

function next(from, to, message)
{
    var streamerName = to.substring(1);
    options.path = "/bot/next?streamer=" + streamerName + "&key=bba3e1c6fbe8e202";
    makeHTTPCall();
}

function open(from, to, message)
{
    var streamerName = to.substring(1);
    options.path = "/bot/open?streamer=" + streamerName + "&key=bba3e1c6fbe8e202";
    makeHTTPCall();
}

function queue(from, to, message)
{
    var streamerName = to.substring(1);
    options.path = "/bot/queue?submitter=" + from + "&streamer=" + streamerName;
    makeHTTPCall();
}

function remove(from, to, message)
{
        var streamerName = to.substring(1);
        var levelCode = message.substring(8);
        options.path = "/bot/remove?streamer=" + streamerName + "&submitter=" + from + "&levelcode=" + levelCode + "&key=bba3e1c6fbe8e202";
        makeHTTPCall();
}

function skip(from, to, message)
{
    var streamerName = to.substring(1);
    options.path = "/bot/skip?streamer=" + streamerName + "&key=bba3e1c6fbe8e202";
    makeHTTPCall();
}

function stats(from, to, message)
{
    var streamerName = to.substring(1);
    options.path = "/bot/stats?streamer=" + streamerName;
    makeHTTPCall();
}

function submit(from, to, message)
{
    var streamerName = to.substring(1);
    options.path = "/bot/submit?streamer=" + streamerName + "&submitter=" + from;
    makeHTTPCall();
}

Array.prototype.contains = function(obj)
{
    var i = this.length;
    while (i--)
    {
        if (this[i] === obj)
        {
            return true;
        }
    }
    return false;
}