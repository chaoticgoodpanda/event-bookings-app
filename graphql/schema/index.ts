export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Event = {
  __typename?: 'Event';
  _id: Scalars['ID'];
  creator: User;
  date: Scalars['String'];
  description: Scalars['String'];
  price: Scalars['Float'];
  title: Scalars['String'];
};

export type EventInput = {
  date: Scalars['String'];
  description: Scalars['String'];
  price: Scalars['Float'];
  title: Scalars['String'];
};

export type RootMutation = {
  __typename?: 'RootMutation';
  createEvent?: Maybe<Event>;
  createUser?: Maybe<User>;
};


export type RootMutationCreateEventArgs = {
  eventInput?: Maybe<EventInput>;
};


export type RootMutationCreateUserArgs = {
  userInput?: Maybe<UserInput>;
};

export type RootQuery = {
  __typename?: 'RootQuery';
  events: Array<Event>;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID'];
  createdEvents?: Maybe<Array<Event>>;
  email: Scalars['String'];
  password?: Maybe<Scalars['String']>;
};

export type UserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};
