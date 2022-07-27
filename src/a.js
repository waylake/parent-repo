const spawn = require('child_process').spawn;

const result = spawn('python', ['resource_control.py']);

result.stdout.on('data', function (data) {
  console.log(data.toString());
});

// result.stderr.on('data', function (data) {
//   console.log(data.toString());
// });