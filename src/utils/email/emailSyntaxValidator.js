// const tlds = require('tlds/index.json')

// class EmailSyntaxValidator {
//   constructor(configParam = {}) {
//     this.config = {
//       local: {
//         alphaUpper: true,
//         alphaLower: true,
//         numeric: true,
//         period: true,
//         printable: true,
//         quote: true,
//         hyphen: true,
//         spaces: true,
//       },
//       domain: {
//         alphaUpper: true,
//         alphaLower: true,
//         numeric: true,
//         period: true,
//         hyphen: true,
//         tld: true,
//         localhost: false,
//         charsBeforeDot: 1,
//         charsAfterDot: 2,
//       },
//     }

//     this.chars = {
//       alphaLower: 'abcdefghijklmnopqrstuvwxyz',
//       alphaUpper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
//       numeric: '0123456789',
//       printable: "!#$%&'*+/=?^_`{|}~",
//       space: ' ',
//       quote: '"',
//       hyphen: '-',
//       period: '.',
//     }

//     this.email = ''

//     for (const key in configParam) {
//       const configGroup = configParam[key]
//       for (const subKey in configGroup) {
//         this.config[key][subKey] = configGroup[subKey]
//       }
//     }
//   }

//   gatherChars(charConfig) {
//     let characters = ''

//     if (charConfig.alphaUpper) characters += this.chars.alphaUpper
//     if (charConfig.alphaLower) characters += this.chars.alphaLower
//     if (charConfig.numeric) characters += this.chars.numeric
//     if (charConfig.hyphen) characters += this.chars.hyphen
//     if (charConfig.period) characters += this.chars.period
//     if ('printable' in charConfig && charConfig.printable) characters += this.chars.printable
//     if ('spaces' in charConfig && charConfig.spaces) characters += this.chars.space
//     if ('quote' in charConfig && charConfig.quote) characters += this.chars.quote

//     return characters.split('')
//   }

//   validateGeneral() {
//     return this.email.indexOf('@') >= 1
//   }

//   validateChars(chars, charsToValidate) {
//     let quoteOpen = false

//     for (let l = 0; l < charsToValidate.length; l++) {
//       const letter = charsToValidate[l]

//       if (this.config.local.quote && letter === '"') {
//         quoteOpen = !quoteOpen

//         if (l !== 0 && l !== charsToValidate.length - 1) {
//           if (quoteOpen && charsToValidate[l - 1] !== '.') return false
//           if (!quoteOpen && charsToValidate[l + 1] !== '.') return false
//         }
//       }

//       if (!chars.includes(letter)) return false
//     }

//     return true
//   }

//   validateLocal() {
//     const validChars = this.gatherChars(this.config.local)
//     let localLetters = this.email.slice(0, this.email.indexOf('@')).split('')

//     if (this.config.local.printable) {
//       const percentIndex = localLetters.indexOf('%')
//       if (percentIndex !== -1) localLetters = localLetters.slice(0, percentIndex)

//       const bangIndex = localLetters.indexOf('!')
//       if (bangIndex !== -1) localLetters = localLetters.slice(bangIndex)
//     }

//     if (localLetters.length > 64) return false
//     if (!this.validateChars(validChars, localLetters)) return false

//     const doublePeriodIndex = this.email.indexOf('..')

//     if (doublePeriodIndex !== -1) {
//       const atIndex = this.email.indexOf('@')

//       if (doublePeriodIndex > atIndex) return false

//       const firstQuote = localLetters.indexOf('"')
//       const lastQuote = localLetters.length - [...localLetters].reverse().indexOf('"') - 1

//       if (firstQuote < 0 || lastQuote < 0) return false
//       if (firstQuote >= doublePeriodIndex || doublePeriodIndex >= lastQuote) return false
//     }

//     const spaceIndex = localLetters.indexOf(' ')
//     if (
//       spaceIndex !== -1 &&
//       (localLetters[spaceIndex + 1] !== '"' || localLetters[spaceIndex - 1] !== '"')
//     ) {
//       return false
//     }

//     return true
//   }

//   validateDomainParts(domain) {
//     const dotIndex = domain.lastIndexOf('.')

//     if (dotIndex === -1 && !this.config.domain.localhost) return false

//     if (dotIndex !== -1) {
//       if (this.config.domain.charsBeforeDot !== -1 && dotIndex <= this.config.domain.charsBeforeDot) {
//         return false
//       }

//       if (
//         this.config.domain.charsAfterDot !== -1 &&
//         dotIndex === domain.length - this.config.domain.charsAfterDot
//       ) {
//         return false
//       }

//       if (this.config.domain.tld) {
//         const tld = domain.slice(dotIndex + 1).toLowerCase()
//         if (!tlds.includes(tld)) return false
//       }
//     }

//     return true
//   }

//   validateDomain() {
//     const domain = this.email.slice(this.email.indexOf('@') + 1)

//     if (!this.validateDomainParts(domain)) return false

//     const validChars = this.gatherChars(this.config.domain)
//     const domainLetters = domain.split('')

//     if (this.config.local.printable) {
//       const localLetters = this.email.slice(0, this.email.indexOf('@')).split('')

//       const percentIndex = localLetters.indexOf('%')
//       if (percentIndex !== -1) {
//         const relayDomain = localLetters.slice(percentIndex + 1)
//         if (!this.validateDomainParts(relayDomain.join(''))) return false
//         if (!this.validateChars(validChars, relayDomain)) return false
//       }

//       const bangIndex = localLetters.indexOf('!')
//       if (bangIndex !== -1) {
//         const relayDomain = localLetters.slice(0, bangIndex)
//         if (!this.validateDomainParts(relayDomain.join(''))) return false
//         if (!this.validateChars(validChars, relayDomain)) return false
//       }
//     }

//     if (!this.validateChars(validChars, domainLetters)) return false

//     return true
//   }

//   async validate(email) {
//     if (typeof email !== 'string' || !email) {
//       console.error('Invalid email provided', email)
//       return false
//     }

//     this.email = email

//     if (!this.validateGeneral()) return false
//     if (!this.validateLocal()) return false
//     if (!this.validateDomain()) return false

//     return true
//   }
// }

// module.exports = EmailSyntaxValidator