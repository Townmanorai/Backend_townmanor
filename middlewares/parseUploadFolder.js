const parseUploadFolder = (req, res, next) => {
    req.body.uploadFolder = req.body.uploadFolder ? req.body.uploadFolder.trim() : 'files/ownproimages';
    // console.log('Parsed uploadFolder:', req.body.uploadFolder); 
    next();
  };
  
  export default parseUploadFolder;
  