export type ApiLink = {
  href: string
}

export type Customer = {
  firstname: string
  lastname: string
  streetaddress: string
  postcode: string
  city: string
  email: string
  phone: string
  _links: {
    self: ApiLink
    customer: ApiLink
    trainings: ApiLink
  }
}

export type CustomerResponse = {
  _embedded: {
    customers: Customer[]
  }
}