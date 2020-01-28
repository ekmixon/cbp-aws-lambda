declare module 'serverless-jest-plugin' {
  interface LambdaWrapper {
    wrap: (handler: any) => {
      run: (data: any) => Promise<any>
    }
  }

  interface ServerlessJestPlugin {
    lambdaWrapper: LambdaWrapper
  }

  const serverlessJestPlugin: ServerlessJestPlugin
  export default serverlessJestPlugin
}
