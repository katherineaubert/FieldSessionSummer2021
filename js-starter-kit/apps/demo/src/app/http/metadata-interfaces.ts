export interface CollectionDictionary {
  client?: string;
  collection: string;
  description?: string;
  undefinedAttributesAction?: string;
  indexes?: IndexDefinition[];
  nodeDefs?: NodeDefinition[];
  rootnode: BaseNodeDefinition;
}

export interface BaseNodeDefinition {
  attributes?: AttributeDefinition[];
  arrays?: ArrayReference[];
  nodes?: NodeReference[];
}

export interface NodeDefinition extends BaseNodeDefinition {
  defName: string;
}

export interface AttributeDefinition {
  name: string;
  datatype?: string;
  precision?: number;
  required?: boolean;
  hideOutput?: boolean; // todo unused on server
  anonymizeOutput?: boolean; // todo unused on server
  description?: string;
}

export interface ArrayReference {
  name: string;
  refName?: string;
  datatype?: string;
}

export interface NodeReference {
  name: string;
  refName: string;
}

export interface IndexDefinition {
  attributes: string[];
  unique?: boolean;
  partialIndexCondition?: string;
}
