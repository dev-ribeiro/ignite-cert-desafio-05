/* eslint-disable prettier/prettier */
import { GetStaticProps } from 'next';
import { useState } from 'react';
import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi'
import { RichText } from 'prismic-dom'
import { getPrismicClient } from '../services/prismic';
import styles from './home.module.scss';
import { DefaultLayout } from '../layouts/DefaultLayout';
import Header from '../components/Header';
import { formatDate } from '../utils/formatDate';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results ?? []);
  const [nextPage, setNextPage] = useState<string | null>(postsPagination.next_page ?? null);

  return (
    <DefaultLayout>
      <Header />
      <div className={styles.posts}>
        {posts.map(post => (
          <Link href={`/post/${post.uid}`} key={post.uid}>
            <section className={styles.card}>
              <h2>{post.data.title}</h2>
              <h3>{post.data.subtitle}</h3>
              <div className={styles.iconWrapper}>
                <div>
                  <FiCalendar color="#BBBBBB" size={20} />
                  <span>{post.first_publication_date}</span>
                </div>
                <div>
                  <FiUser color="#BBBBBB" size={20} />
                  <span>{post.data.author}</span>
                </div>
              </div>
            </section>
          </Link>
        ))}
      </div>
    </DefaultLayout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});

  const postsResponse = await prismic.getByType('posts', {
    pageSize: 1
  });

  const posts = postsResponse.results.map(post => {
    return {
      ...post,
      first_publication_date: formatDate(post.first_publication_date),
    };
  });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts
      },
    },
  };
};
