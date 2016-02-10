var settings =
        {
            channels : ["removed"],
            server : "irc.twitch.tv",
            port: 6667,
            secure: false,
            nick : "remove",
            password : "removed"
        };

var options = 
    {
        host: "warp.world"
    };



var irc = require("irc");
var http = require("http");

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