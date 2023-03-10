/* tslint:disable */
/**
 * This file was automatically generated by Payload CMS.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "questions".
 */
export interface Question {
  id: string;
  questionText?: string;
  displayOrder?: number;
  provinces?: string[] | Province[];
  answers: {
    answerText?: string;
    provinces?: string[] | Province[];
    recommendTags?: string[] | Tag[];
    id?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "provinces".
 */
export interface Province {
  id: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "tags".
 */
export interface Tag {
  id: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "cities".
 */
export interface City {
  id: string;
  name?: string;
  province: string | Province;
  'comparable-data': {
    climate: {
      'meta-data'?: string | GroupMetaDatum;
      'summer-high'?: number;
      'summer-low'?: number;
    };
    people: {
      'meta-data'?: string | GroupMetaDatum;
      population?: number;
      'english-speakers-percent'?: number;
    };
  };
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "group-meta-data".
 */
export interface GroupMetaDatum {
  id: string;
  description?: string;
  'field-meta-data': {
    name?: string;
    description?: string;
    unit: 'persons' | 'percent' | 'dollars' | 'centigrade' | 'localized text';
    id?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "chapters".
 */
export interface Chapter {
  id: string;
  name?: string;
  displayOrder?: number;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "topics".
 */
export interface Topic {
  id: string;
  name?: string;
  tags?: string[] | Tag[];
  content?: string;
  chapters?: string[] | Chapter[];
  provinces?: string[] | Province[];
  displayOrder?: number;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: string;
  email?: string;
  resetPasswordToken?: string;
  resetPasswordExpiration?: string;
  loginAttempts?: number;
  lockUntil?: string;
  createdAt: string;
  updatedAt: string;
}
