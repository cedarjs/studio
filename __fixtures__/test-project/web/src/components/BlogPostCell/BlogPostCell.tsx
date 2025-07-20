import type {
  FindBlogPostQuery,
  FindBlogPostQueryVariables,
} from 'types/graphql'

import { Metadata } from '@cedarjs/web'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@cedarjs/web'

import BlogPost from 'src/components/BlogPost'
import { getFirstNSentences } from 'src/lib/formatters'

export const QUERY: TypedDocumentNode<
  FindBlogPostQuery,
  FindBlogPostQueryVariables
> = gql`
  query FindBlogPostQuery($id: Int!) {
    blogPost: post(id: $id) {
      id
      title
      body
      imageUrl
      author {
        email
        fullName
      }
      createdAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindBlogPostQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  blogPost,
}: CellSuccessProps<FindBlogPostQuery, FindBlogPostQueryVariables>) => (
  <>
    <Metadata
      title={blogPost.title}
      og={{
        title: `${blogPost.title} | CedarJS Blog`,
        description: getFirstNSentences(blogPost.body, 1),
        site_name: 'cedarjs.com',
        image: blogPost.imageUrl,
        url: `https://cedarjs.com/blog-posts/${blogPost.id}`,
      }}
      article={{
        author: blogPost.author.fullName,
        published_date: blogPost.createdAt,
        published_time: blogPost.createdAt,
      }}
      profile={{
        username: blogPost.author.fullName,
      }}
      twitter={{
        card: blogPost.id === 3 ? null : 'summary_large_image',
        site: 'cedarjs.com',
        url: `https://cedarjs.com/blog-posts/${blogPost.id}`,
        creator: `@${blogPost.author.fullName}`,
        title: blogPost.id === 2 ? null : `${blogPost.title} | CedarJS Blog`,
        description: getFirstNSentences(blogPost.body, 1),
        image: blogPost.imageUrl,
        'image:alt': 'this is a description of image',
      }}
    />
    <BlogPost blogPost={blogPost} />
  </>
)
