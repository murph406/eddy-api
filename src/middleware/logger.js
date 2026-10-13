
const logger = async (event, context) => {
  console.log('\nEVENT::', event, '\n')
  console.log('\nCONTEXT::', context, '\n')
}

module.exports = logger