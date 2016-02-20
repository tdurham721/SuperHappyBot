var settings =
        {
            channels : ["#thabeast721"],
            server : "irc.twitch.tv",
            port: 6667,
            secure: false,
            nick : "Super_Happy_Bot",
            password : "oauth:slbgkt15b6ryl7eh0k6h3ctxcz2gkq"
        };

var options = 
    {
        host: "warp.world"
    };

var irc = require("irc");
var http = require("http");

var botCommands = [/!add ([a-z0-9]{4}-){3}[a-z0-9]{4}/i,
                   /!close/i,
                   /!completed/i,
                   /!current/i,
                   /!list/i,
                   /!next/i,
                   /!open/i,
                   /!queue/i,
                   /!remove ([a-z0-9]{4}-){3}[a-z0-9]{4}/i,
                   /!skip/i,
                   /!stats/i,
                   /!submit( ([a-z0-9]{4}-){3}[a-z0-9]{4})?/i,
                   /!initiaterage "[a-z0-9]+" "[a-z0-9]+"/i,
                   /!stoprage/i];

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

bot.addListener("message", add);
bot.addListener("message", close);
bot.addListener("message", completed);
bot.addListener("message", current);
bot.addListener("message", list);
bot.addListener("message", next);
bot.addListener("message", open);
bot.addListener("message", queue);
bot.addListener("message", remove);
bot.addListener("message", skip);
bot.addListener("message", stats);
bot.addListener("message", submit);
bot.addListener("message", trackTF);

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

function intitiateRage(from, to, message)
{
    var RE = /!initiaterage "[a-z0-9]+" "[a-z0-9]+"/i;
    if (message.match(RE) != null)
    {
        listOfUserRage = [];
        var messageCopy = message;
        var firstWord = messageCopy.substring(15, message.indexOf("\""));
        messageCopy = messageCopy.substring(messageCopy.indexOf("\"") + 3);
        var secondWord = messageCopy.substring(0, messageCopy.indexOf("\""));
        var postToServer = setInterval(trackRage(firstWord, secondWord, listOfUserRage, 5000));
    }
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
            let iterable = listOfUserRage;
            for (let entry of iterable)
            {
                if (entry.username === from && entry.answer === answer)
                {
                    alreadyEntered = true;
                    break;    
                }
            }
            if (!alreadyEntered)
            {
                listOfUserRage.push(new UserRage(from, answer));
            }
        }
    } );
    //post info to server here. need to figure out how to do this
}

function add(from, to, message)
{
    var RE = /!add ([a-z0-9]{4}-){3}[a-z0-9]{4}/i;
    if (message.match(RE) != null)
        {
            var streamerName = to.substring(1);
            var levelCode = message.substring(5);
            options.path = "/bot/add?streamer=" + streamerName + "&key=bba3e1c6fbe8e202&submitter=" + from + "&levelcode=" + levelCode;
            makeHTTPCall();
        };
};

function close(from, to, message)
{
    var RE = /!close/i;
    if (message.match(RE) != null)
        {
            var streamerName = to.substring(1);
            options.path = "/bot/close?streamer=" + streamerName + "&key=bba3e1c6fbe8e202";
            makeHTTPCall();
        }
}

function completed(from, to, message)
{
    var RE = /!completed/i;
    if (message.match(RE) != null)
    {
        var streamerName = to.substring(1);
        options.path = "/bot/complete?streamer=" + streamerName + "&key=bba3e1c6fbe8e202";
        makeHTTPCall();
    }
}

function current(from, to, message)
{
    var RE = /!current/i;
    if (message.match(RE) != null)
    {
        console.log(from);
        var streamerName = to.substring(1);
        options.path = "/bot/current?streamer=" + streamerName + "&submitter=" + from;
        makeHTTPCall();
    }
}

function list(from, to, message)
{
    var RE = /!list/i;
    if (message.match(RE) != null)
    {
        var streamerName = to.substring(1);
        options.path = "/bot/list?streamer=" + streamerName + "&submitter=" + from;
        makeHTTPCall();
    }
}

function next(from, to, message)
{
    var RE = /!next/i;
    if (message.match(RE) != null)
    {
        var streamerName = to.substring(1);
        options.path = "/bot/next?streamer=" + streamerName + "&key=bba3e1c6fbe8e202";
        makeHTTPCall();
    }
}

function open(from, to, message)
{
    var RE = /!open/i;
    if (message.match(RE) != null)
    {
        var streamerName = to.substring(1);
        options.path = "/bot/open?streamer=" + streamerName + "&key=bba3e1c6fbe8e202";
        makeHTTPCall();
    }
}

function queue(from, to, message)
{
    var RE = /!queue/i;
    if (message.match(RE) != null)
    {
        var streamerName = to.substring(1);
        options.path = "/bot/queue?submitter=" + from + "&streamer=" + streamerName;
        makeHTTPCall();
    }
}

function remove(from, to, message)
{
    var RE = /!remove ([a-z0-9]{4}-){3}[a-z0-9]{4}/i;
    if (message.match(RE) != null)
    {
        var streamerName = to.substring(1);
        var levelCode = message.substring(8);
        options.path = "/bot/remove?streamer=" + streamerName + "&submitter=" + from + "&levelcode=" + levelCode + "&key=bba3e1c6fbe8e202";
        makeHTTPCall();
    }
}

function skip(from, to, message)
{
    var RE = /!skip/i;
    if (message.match(RE) != null)
    {
        var streamerName = to.substring(1);
        options.path = "/bot/skip?streamer=" + streamerName + "&key=bba3e1c6fbe8e202";
        makeHTTPCall();
    }
}

function stats(from, to, message)
{
    var RE = /!stats/i;
    if (message.match(RE) != null)
    {
        var streamerName = to.substring(1);
        options.path = "/bot/stats?streamer=" + streamerName;
        makeHTTPCall();
    }
}

function submit(from, to, message)
{
    var RE = /!submit( ([a-z0-9]{4}-){3}[a-z0-9]{4})?/i
    if (message.match(RE) != null)
    {
        var streamerName = to.substring(1);
        options.path = "/bot/submit?streamer=" + streamerName + "&submitter=" + from;
        makeHTTPCall();
    }
}