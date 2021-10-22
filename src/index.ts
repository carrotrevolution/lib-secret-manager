import {SecretManagerServiceClient} from '@google-cloud/secret-manager';

interface SecretHelperConfig {
  projectId: string;
  secretName: string;
  secretVersion?: string;
}

const secretManagerClient = new SecretManagerServiceClient();

export class SecretHelper {
  private value?: string | Uint8Array | null | undefined;
  readonly secretVersionName: string;

  constructor(config: SecretHelperConfig) {
    const {projectId, secretName, secretVersion} = config;
    this.secretVersionName = `projects/${projectId}/secrets/${secretName}/versions/${secretVersion}`;
  }

  async getSecret() {
    if (!this.value) {
      this.value = await this.fetchSecret();
    }
    return this.value;
  }

  private async fetchSecret() {
    const [version] = await secretManagerClient.accessSecretVersion({
      name: this.secretVersionName,
    });
    const secret = version.payload?.data;
    if (!secret) {
      throw new Error(`No value found for secret ${this.secretVersionName}.`);
    }
    return secret.toString();
  }
}
