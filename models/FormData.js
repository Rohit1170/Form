const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema({
  serialNumber: String,
  fileNumber: String,
  portName: String,
  placeOfPort: String,
  caseNumber: String,
  fileOpeningDate: String,
  petitionerName: String,
  councilName: String,
  dateOfFiling: String,
  dateOfHearing: String,
  remarksStatus: String,
  category: String,
  dateOfDisposal: String,
});

const FormData = mongoose.model('FormData', formDataSchema);

module.exports = FormData;
