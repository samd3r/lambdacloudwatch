/*
  Welcome to async callback hell Davy ;)
*/

var AWS = require("aws-sdk");
AWS.config.region = 'eu-central-1';

// test message won't work without specific creds.
var jsonContent = require("./test-messages.json");

var ec2 = new AWS.EC2();
ec2.describeInstances({
	  InstanceIds: [jsonContent.detail["instance-id"]]
	},describeResult);

function describeResult(err,data){
	if(err) {
		console.error(err.toString());
	} else {
		var name = '';
		var tags = data.Reservations[0].Instances[0].Tags[0];
		
		if (tags.Key == 'Name') {
			name = tags.Value;
		}
		
		console.log('name = ' + name);
		console.log("detail-type   : " + jsonContent["detail-type"]);
		console.log("time          : " + jsonContent.time);
		console.log("region        : " + jsonContent.region);
		console.log("instance-id   : " + jsonContent.detail["instance-id"]);
		console.log("instance-name : " + name);
		console.log("state         : " + jsonContent.detail.state);
	}
}
