import {SecretManagerServiceClient} from '@google-cloud/secret-manager';

interface SecretHelperConfig {
  projectId: string;
  secretName: string;
  secretVersion?: string;
}

const secretManagerClient = new SecretManagerServiceClient();

export class SecretHelper {
  private value?: string | Uint8Array | null | undefined;

  constructor(private readonly config: SecretHelperConfig) {
    this.getSecret();
  }

  async getSecret() {
    if (!this.value) {
      this.value = await this.fetchSecret();
    }
    return this.value;
  }

  private async fetchSecret() {
    const {projectId, secretName, secretVersion} = this.config;

    const name = `projects/${projectId}/secrets/${secretName}/versions/${secretVersion}`;
    const [version] = await secretManagerClient.accessSecretVersion({
      name,
    });
    const secret = version.payload?.data;
    if (!secret) {
      throw new Error(`No value found for secret ${name}.`);
    }
    return secret.toString();
  }
}
