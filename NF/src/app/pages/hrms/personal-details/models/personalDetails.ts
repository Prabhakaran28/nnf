export class NbPersonalDetails {

    constructor(public id?: number,
                public firstName?: string,
                public lastName?: string,
                public email?: string,
                public phone?: number,
                public streetAddress?: string,
                public city?: string,
                public state?: string,
                public country?: string,
                public zip?: string) {
    }
  }