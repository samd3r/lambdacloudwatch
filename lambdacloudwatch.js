/*
  I'm trying to write an AWS Lambda function that will pull in CouldWatch event notifications
  get some useful context about the ec2 instance (name, type etc) and push that to HipChat
  or Email.

  I'm really not very good at JS so it's super hacky and have got a problem with variable scope.

  I want to pull out info gathered from ec2.desribeInstances function call to assign to variables in the top level scope.
  Currently getting [object Object] or undefined depending on how I cut it.

  Any ideas?
  Davy Jones 2016

*/
// pulling some libraries like a boss
// need to npm install awk-sdk
// test message won't work without specific creds.
var fs = require("fs");
var AWS = require("aws-sdk");
AWS.config.region = 'eu-central-1';

// test message won't work without specific creds.
var contents = fs.readFileSync("test-messages.json");
var jsonContent = JSON.parse(contents);
var instanceId = jsonContent.detail["instance-id"]

var ec2 = new AWS.EC2();
var name = ec2Name(instanceId);

// wrapped this in a function to try and pull out the instance name into a var
function ec2Name(ec2ID) {
  var params = {
    InstanceIds: [ec2ID]
  };
  var nameGet = ec2.describeInstances(params, function(err, data) {
		if(err) {
		console.error(err.toString());
		} else {
			var name = ''
			var tags = data.Reservations[0].Instances[0].Tags[0]
			if (tags.Key == 'Name') {
				name = tags.Value;
			}
		}
    // this returns correctly but after the console logs below.
		console.log('name = ' + name);
		return name;
	});
  // this returns as [object Object]
	return nameGet;
};

console.log("detail-type   : " + jsonContent["detail-type"]);
console.log("time          : " + jsonContent.time);
console.log("region        : " + jsonContent.region);
console.log("instance-id   : " + instanceId);
console.log("instance-name : " + name);
console.log("state         : " + jsonContent.detail.state);

//  Output of above:
//  detail-type   : EC2 Instance State-change Notification
//  time          : 2016-04-22T08:09:44Z
//  region        : eu-central-1
//  instance-id   : i-5176eded
//  instance-name : [object Object]
//  state         : pending
//  name = test
