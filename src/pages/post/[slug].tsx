import { GetStaticPaths, GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import Head from 'next/head';
import { getPrismicClient } from '../../services/prismic';
import styles from './post.module.scss';
import { calcReadTime } from '../../utils/calcReadTime';
import { PostLayout } from '../../layouts/PostLayout';
import Header from '../../components/Header';
import { formatDate } from '../../utils/formatDate';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const [readTime, setReadTime] = useState(0);
  const { isFallback } = useRouter();

  const {
    data: { author, banner, content, title },
    first_publication_date,
  } = post!;

  useEffect(() => {
    if (!isFallback) {
      const calculatedTime = calcReadTime({ content });

      setReadTime(calculatedTime);
    }
  }, []);

  if (isFallback) {
    return (
      <div className={styles.loadingContainer}>
        <h2>Carregando...</h2>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{title} | Spacetraveling</title>
      </Head>
      <PostLayout>
        <div className={styles.headerWrapper}>
          <Header />
        </div>
        <div className={styles.bannerWrapper}>
          <Image src={banner.url} width="auto" height="auto" />
        </div>
        <section className={styles.mainContainer}>
          <section className={styles.heading}>
            <h1>{title}</h1>
            <div>
              <span>
                <FiCalendar />
                {formatDate(first_publication_date)}
              </span>
              <span>
                <FiUser />
                {author}
              </span>
              <span>
                <FiClock />
                {readTime} min
              </span>
            </div>
          </section>
          <div className={styles.contentContainer}>
            {content.map(section => {
              const sectionKey = JSON.stringify(section);

              return (
                <section key={sectionKey} className={styles.contentWrapper}>
                  <h3>{section.heading}</h3>
                  <div>
                    {section.body.map((postContent, j) => {
                      const key = String(j);

                      return (
                        <div key={key}>
                          <p>{postContent.text}</p>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </section>
      </PostLayout>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');

  const postsPaths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths: postsPaths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(slug));

  return {
    props: {
      post: response,
    },
  };
};
