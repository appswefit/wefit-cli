import axios, { AxiosInstance } from "axios";
import { Node } from "./figmaClient.types";

interface GetNodesUrl {
  images: Record<string, string>;
}

export default class FigmaClient {
  private httpClient: AxiosInstance;
  private fileId: string;

  constructor(figmaToken: string, fileId: string) {
    this.httpClient = axios.create({
      baseURL: "https://api.figma.com/v1",
      headers: {
        "X-Figma-Token": figmaToken,
      },
    });

    this.fileId = fileId;
  }

  public async getFile() {
    const { data } = await this.httpClient.get<{ document: Node<"DOCUMENT"> }>(
      `/files/${this.fileId}`
    );

    return data.document;
  }

  public async getNodeUrl(nodeIds: string[]) {
    const { data } = await this.httpClient.get<GetNodesUrl>(
      `/images/${this.fileId}`,
      {
        params: {
          ids: nodeIds.toString(),
          format: "svg",
        },
      }
    );

    return data;
  }
}
