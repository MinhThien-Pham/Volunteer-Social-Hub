import { useParams } from "react-router";

const EditPost = () => {
  const { id } = useParams();

  return (
    <section>
      <h1>Edit Post</h1>
      <p>Editing post ID: {id}</p>
    </section>
  );
};

export default EditPost;