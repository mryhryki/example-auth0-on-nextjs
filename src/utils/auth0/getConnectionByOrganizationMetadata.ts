export interface Auth0ConnectionByOrganizationMetadata {
  connectionId: string
  displayName: string;
  enabled: boolean;
  name: string
}

const checkBoolean = (value: unknown, name: string): boolean => {
  if (typeof value === 'boolean') {
    return value
  }
  throw new Error(`"${name}" is not a boolean: ${JSON.stringify(value)}`)
}

const checkNotEmptyString = (value: unknown, name: string): string => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim()
  }
  throw new Error(`"${name}" is not a string or blank: ${JSON.stringify(value)}`)
}

export const getConnectionByOrganizationMetadata = (organizationMetadata: Record<string, string | undefined>): Auth0ConnectionByOrganizationMetadata[] =>
  Object.keys(organizationMetadata)
        .filter((key) => key.startsWith('con_') && organizationMetadata[key] != null)
        .map((connectionId): Auth0ConnectionByOrganizationMetadata => {
          const connectionMetadataJsonText: string = organizationMetadata[connectionId] ?? '-'
          const connectionMetadata = JSON.parse(connectionMetadataJsonText)
          const { displayName, enabled, name } = connectionMetadata

          return {
            connectionId: checkNotEmptyString(connectionId, 'connectionId'),
            displayName: checkNotEmptyString(displayName, 'displayName'),
            enabled: checkBoolean(enabled, 'enabled'),
            name: checkNotEmptyString(name, 'name'),
          }
        })
