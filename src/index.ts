import {SecretManagerServiceClient} from '@google-cloud/secret-manager';

export class SecretHelper {
  private readonly projectID = 'carrotkitchen';

  private value?: string | Uint8Array | null | undefined;
  private client = new SecretManagerServiceClient();

  async getSecret(secretName: string, secretVersion = 'latest') {
    if (!this.value) {
      this.value = await this.fetchSecret(secretName, secretVersion);
    }
    return this.value;
  }

  private async fetchSecret(secretName: string, secretVersion: string) {
    const name = `projects/${this.projectID}/secrets/${secretName}/versions/${secretVersion}`;
    const [version] = await this.client.accessSecretVersion({
      name,
    });
    const secret = version.payload?.data;
    if (!secret) {
      throw new Error(`Invalid Secret: ${name}. No value found.`);
    }
    return secret;
  }
}
