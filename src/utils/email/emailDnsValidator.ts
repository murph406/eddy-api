// const dns = require('dns')
// const net = require('net')

// class EmailDnsValidator {
//   constructor(configParam = {}) {
//     this.config = {
//       a: 1,
//       ns: 100,
//       spf: 10,
//       mx: 100,
//       port: 10,
//       validScore: 310,
//       smtpPorts: [25, 465, 587],
//       ...configParam
//     }
//     this.email = ''
//     this.domain = ''
//   }

//   async validateDNS() {
//     let dnsValidationFail = false
//     let score = 0
//     const promises = []

//     if (this.config.ns !== -1) {
//       promises.push(
//         this.getNsRecord()
//           .then((addresses) => {
//             if (addresses.length) score += this.config.ns
//           })
//           .catch((err) => {
//             dnsValidationFail = true
//             console.error('ERROR GETTING NS: ', err)
//           })
//       )
//     }

//     if (this.config.mx !== -1) {
//       promises.push(
//         this.getMxRecord()
//           .then((addresses) => {
//             if (addresses.length) {
//               score += this.config.mx
//               if (this.config.port !== -1) {
//                 for (const port of this.config.smtpPorts) {
//                   for (const { exchange: host } of addresses) {
//                     promises.push(
//                       this.isPortReachable(port, { host })
//                         .then((reachable) => {
//                           if (reachable) score += this.config.port
//                         })
//                         .catch((err) => console.error('ERROR REACHING PORT: ', err))
//                     )
//                   }
//                 }
//               }
//             }
//           })
//           .catch((err) => {
//             dnsValidationFail = true
//             console.error('ERROR GETTING MX: ', err)
//           })
//       )
//     }

//     if (this.config.spf !== -1) {
//       promises.push(
//         this.getTxtRecord()
//           .then((addresses) => {
//             for (const address of addresses) {
//               if (address.indexOf('spf') !== -1) {
//                 score += this.config.spf
//                 break
//               }
//             }
//           })
//           .catch((err) => console.error('ERROR GETTING TXT: ', err))
//       )
//     }

//     if (this.config.a !== -1) {
//       promises.push(
//         this.getARecord()
//           .then((addresses) => {
//             if (addresses.length) score += this.config.a
//           })
//           .catch((err) => console.error('ERROR GETTING A: ', err))
//       )
//     }

//     await Promise.all(promises)

//     if (dnsValidationFail) return false

//     return this.config.validScore <= score
//   }

//   getNsRecord() {
//     return new Promise((resolve, reject) => {
//       dns.resolve(this.domain, 'NS', (err, addresses) => {
//         if (err || !addresses) {
//           console.error(this.domain, 'has no NS')
//           reject(err)
//         } else {
//           resolve(addresses)
//         }
//       })
//     })
//   }

//   getARecord() {
//     return new Promise((resolve, reject) => {
//       dns.resolve(this.domain, 'A', (err, addresses) => {
//         if (err || !addresses) {
//           console.error(this.domain, 'has no A')
//           reject(err)
//         } else {
//           resolve(addresses)
//         }
//       })
//     })
//   }

//   getMxRecord() {
//     return new Promise((resolve, reject) => {
//       dns.resolve(this.domain, 'MX', (err, addresses) => {
//         if (err || !addresses) {
//           console.error(this.domain, 'has no MX')
//           reject(err)
//         } else {
//           resolve(addresses)
//         }
//       })
//     })
//   }

//   getTxtRecord() {
//     return new Promise((resolve, reject) => {
//       dns.resolve(this.domain, 'TXT', (err, addresses) => {
//         if (err || !addresses) {
//           console.error(this.domain, 'has no TXT')
//           reject(err)
//         } else {
//           resolve(addresses.flat())
//         }
//       })
//     })
//   }

//   isPortReachable(port, { host, timeout = 500 }) {
//     return new Promise((resolve) => {
//       const socket = new net.Socket()

//       const onError = () => {
//         socket.destroy()
//         resolve(false)
//       }

//       socket.setTimeout(timeout)
//       socket.once('error', onError)
//       socket.once('timeout', onError)
//       socket.connect(port, host, () => {
//         socket.end()
//         resolve(true)
//       })
//     })
//   }

//   setEmailDetails(email) {
//     if (typeof email !== 'string' || !email) {
//       console.error('Invalid email provided', email)
//       return false
//     }

//     this.email = email.trim()
//     this.domain = this.email.slice(this.email.indexOf('@') + 1).toLowerCase()
//   }

//   async validate(email) {
//     if (this.setEmailDetails(email) === false) return false
//     return await this.validateDNS()
//   }

//   async isGSuiteMX(email) {
//     if (this.setEmailDetails(email) === false) return false

//     try {
//       const addresses = await this.getMxRecord()
//       return addresses.some((a) => a.exchange.toLowerCase().includes('aspmx.l.google.com'))
//     } catch (err) {
//       console.error('ERROR GETTING MX in isGSuiteMX: ', err)
//       return false
//     }
//   }

//   async isDefaultNamecheapMX(email) {
//     if (this.setEmailDetails(email) === false) return false

//     try {
//       const addresses = await this.getMxRecord()
//       return addresses.some((a) => a.exchange.toLowerCase().includes('registrar-servers.com'))
//     } catch (err) {
//       console.error('ERROR GETTING MX in isDefaultNamecheapMX: ', err)
//       return false
//     }
//   }
// }

// module.exports = EmailDnsValidator