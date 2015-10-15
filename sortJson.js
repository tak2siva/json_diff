window.diffType = "assertDiff";

function sortObject(object) {
    var sortedObj = {};
    var keys = _.keys(object);

    keys = _.sortBy(keys, function (key) {
        return key;
    });

    _.each(keys, function (key) {
        if (typeof object[key] == 'object' && !(object[key] instanceof Array)) {
            sortedObj[key] = sortObject(object[key]);
        } else {
            sortedObj[key] = object[key];
        }
    });

    return sortedObj;
}

function getPrettyText(rawText) {
    var obj = rawText;
    while (obj && typeof(obj) != "object")
        obj = JSON.parse(obj);

    obj = sortObject(obj);

    var prettyText = JSON.stringify(obj, null, 2);
    return prettyText;
}

function getBaseText() {
    var txt;
    if (window.diffType == "assertDiff") {
        txt = $("#assertErrText").val();
        return txt.match("Expected: (.*)")[0].replace("Expected: ", "");
    } else {
        txt = $("#baseText").val();
        return txt;
    }
}

function getNeWText() {
    var txt;
    if (window.diffType == "assertDiff") {
        txt = $("#assertErrText").val()
        return txt.match(/got: (.*)/i)[0].replace(/got: /i, "");
    } else {
        txt = $("#newText").val();
        return txt;
    }
}

function showAssertionDiff(viewType) {
    try {
        var baseText = getBaseText();
        var newText = getNeWText();
    } catch (e) {
        alert("Invalid input");
    }

    baseText = difflib.stringAsLines(getPrettyText(baseText));
    newText = difflib.stringAsLines(getPrettyText(newText));


    //console.log(baseText)
    //console.log(newText)

    var sm = new difflib.SequenceMatcher(baseText, newText);
    var opcodes = sm.get_opcodes();

    var outputDiv = $("#diffoutput");
    outputDiv.html("");

    outputDiv.append(diffview.buildView({
        baseTextLines: baseText,
        newTextLines: newText,
        opcodes: opcodes,
        baseTextName: "Expected",
        newTextName: "Got",
        contextSize: null,
        viewType: viewType
    }));
}
