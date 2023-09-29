

export default function Post( data ){

    const page = data.pages;

    return (
        <div>
            {page && (
        <div>
            <h1>{page.title}</h1>
            <article dangerouslySetInnerHTML={{ __html: page.content }}></article>
        </div>
    )}
        </div>
    )

}

export async function getStaticProps(context) {
try{
    const res = await fetch('http://trialtest1.local/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
                query HomePageQuery($id: ID!, $idType: PostIdType!) {
                    pages(id: $id, idType: $idType) {
                        title
                        slug
                        content
                        
                        }
                    }
                }
            `,
            variables: {
                id: context.params.slug,
                idType: 'SLUG'
            }
        })
    })

    const json = await res.json()

    if (json.errors) {
        console.error('GraphQL Errors:', json.errors);
        throw new Error('Failed to fetch data from GraphQL');
    }
    return {
        props: {
            page: json.data.page,
        },
    }
}catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
        notFound: true,
    };
}
}

export async function getStaticPaths(context) {
    try{
    const res = await fetch('http://trialtest1.local/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
            query HomePageQuery {
                pages {
                    nodes {
                        slug
                        content
                        title
                        
                        }
                    }
                }
            }
        `,
        
        })
    })

    const json = await res.json()
    const pages = json.data?.pages?.nodes;

    if (!pages || !Array.isArray(pages)) {
        throw new Error('Pages data is missing or not an array.');
    }

    const paths =
    pages?.map((page) => ({
        params: { slug: page.slug.split('/') },
    }))
  console.log('Generated paths:', paths)
  return { paths: paths || [], fallback: false };
}catch(error){
    console.log('Error in getStaticPaths:', error)
    
}
return { paths: [], fallback: false }
    
    

    

}