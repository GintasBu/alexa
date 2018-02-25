'use strict';
var Alexa = require('alexa-sdk');
var APP_ID = undefined;  // can be replaced with your app ID if publishing
var facts = require('./facts');
var GET_FACT_MSG_EN = [
    "Here's your fact: ",
    "Would you like to know that: ",
    "Let me introduce you to this fact: ",
    "There has been know that: ",
    "Artificial intelligence history says that: ",
    "Listen to this fact: ",
    "What about this fact: ",
    "In case you wanted to know: ",
    "This is what I found: ",
    "In facts list is written that: "
];
var GET_FACT_NY_MSG = [
    "Here's your fact for year : ",
    "There is no facts for that year, but here is a random fact"
];

// Test hooks - do not remove!
exports.GetFactMsg =GET_FACT_MSG_EN;
var APP_ID_TEST = "mochatest";  // used for mocha tests to prevent warning
// end Test hooks
exports.GetFactMsgNY = GET_FACT_NY_MSG;

/*
    TODO (Part 2) add messages needed for the additional intent
    TODO (Part 3) add reprompt messages as needed
*/
var languageStrings = {
    "en": {
        "translation": {
            "FACTS": facts.FACTS_EN,
            "SKILL_NAME": "My History Facts",  // OPTIONAL change this to a more descriptive name
            "GET_FACT_MESSAGE": GET_FACT_MSG_EN,
            "HELP_MESSAGE": "You can say tell me a fact, or, you can say exit... What can I help you with?",
            "HELP_REPROMPT": "What can I help you with?",
            "STOP_MESSAGE": "Goodbye!",
            "Get_Fact_for_that_Year": GET_FACT_NY_MSG[0],
            "Get_Fact_for_that_Year_random": GET_FACT_NY_MSG[1],
            "repromt": 'say get new fact or stop', //repromt 
            "repromt_year": 'do you want a fact for a specific year'  //repromt  for specific year
        }
    }
};

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // set a test appId if running the mocha local tests
    if (event.session.application.applicationId == "mochatest") {
        alexa.appId = APP_ID_TEST
    }
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

/*
    TODO (Part 2) add an intent for specifying a fact by year named 'GetNewYearFactIntent'
    TODO (Part 2) provide a function for the new intent named 'GetYearFact' 
        that emits a randomized fact that includes the year requested by the user
        - if such a fact is not available, tell the user this and provide an alternative fact.
    TODO (Part 3) Keep the session open by providing the fact with :askWithCard instead of :tellWithCard
        - make sure the user knows that they need to respond
        - provide a reprompt that lets the user know how they can respond
    TODO (Part 3) Provide a randomized response for the GET_FACT_MESSAGE
        - add message to the array GET_FACT_MSG_EN
        - randomize this starting portion of the response for conversational variety
*/

var handlers = {
    'LaunchRequest': function () {
        this.emit('GetFact');
    },
    'GetNewFactIntent': function () {
        this.emit('GetFact');
    },
    'GetFact': function () {
        // Get a random fact from the facts list
        // Use this.t() to get corresponding language data
        var factArr = this.t('FACTS');
        var randomFact = randomPhrase(factArr);

        // Create speech output
        var askquestion = 'say get new fact or stop';
        //radomizing GET_FACT_MSG_EN output:
        var speechOutput = randomPhrase(GET_FACT_MSG_EN) + randomFact;
        this.emit(':askWithCard', speechOutput, this.t("repromt"), this.t("SKILL_NAME"), randomFact)
    },
    'GetNewYearFactIntent': function () {
        this.emit('GetYearFact');
    },
    'GetYearFact': function (){
        var factArr=this.t('FACTS');
        var year=this.event.request.intent.slots["FACT_YEAR"].value;
        var factsS=[];
        for (var i=0; i<factArr.length; i++){
            if(factArr[i].includes(year)){
                factsS.push(factArr[i]) }
        }

        if (factsS.length) {   // if facts for that year were found
            
            var yearFact=randomPhrase(factsS);
            var speechOutput=this.t("Get_Fact_for_that_Year")+yearFact;
            this.emit(':askWithCard', speechOutput, this.t("repromt_year"), this.t("SKILL_NAME"), yearFact)
        }
        else {  //if facts for that year were not found
            var yearFact2=randomPhrase(factArr);
            var speechOutput = this.t("Get_Fact_for_that_Year_random") + yearFact2;
            this.emit(':askWithCard', speechOutput, this.t("repromt_year"), this.t("SKILL_NAME"), yearFact2)
        }
        
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = this.t("HELP_MESSAGE");
        var reprompt = this.t("HELP_MESSAGE");
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    }
};

function randomPhrase(phraseArr) {
    // returns a random phrase
    // where phraseArr is an array of string phrases
    var i = 0;
    i = Math.floor(Math.random() * phraseArr.length);
    return (phraseArr[i]);
};
