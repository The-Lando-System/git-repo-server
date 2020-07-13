module.exports = {

  errorResponse: function(message, details) {
    return {
      'error' : message,
      'details' : details
    }
  },

  dataResponse: function(data) {
    return {
      'data' : data
    }
  }

};