import AWS from 'aws-sdk';

// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, 
//   region: 'your-region' 
// });


AWS.config.update({
    accessKeyId: 'AKIA2NK3YFK2YLHSYC5P', 
    secretAccessKey: 'YMS/dg/w2eEzzCAKHfJ19t5uR8mXyQCmpn2+QeFt', 
    region: 'ap-south-1' 
  });


const s3 = new AWS.S3();
export default s3;
