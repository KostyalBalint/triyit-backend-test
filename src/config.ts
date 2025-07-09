import { get } from 'env-var';


export const config = {
    port: get('PORT').default('8080').asString(),
    host: get('HOST').default('localhost').asString(),
    gqlPath: get('GQL_PATH').default('/gql').asString(),
}