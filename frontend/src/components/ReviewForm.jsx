import { useReview } from "../context/ReviewsContext";

const ReviewForm = ({ id }) => {
  const { addReview } = useReview();

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const review = {
            id: Date.now(),
            movieId: id,
            texto: formData.get("reseña"),
            estrellas: formData.get("ReviewStar"),
          };
          addReview(review);
          e.target.reset();
        }}
        className="flex flex-col space-y-4"
      >
        <div>
          <select name="ReviewStar" id="ReviewStar">
            <option value="1">1⭐</option>
            <option value="2">2⭐</option>
            <option value="3">3⭐</option>
            <option value="4">4⭐</option>
            <option value="5">5⭐</option>
            <option value="6">6⭐</option>
            <option value="7">7⭐</option>
            <option value="8">8⭐</option>
            <option value="9">9⭐</option>
            <option value="10">10⭐</option>
          </select>
        </div>
        <div>
          <textarea id="reseña" name="reseña" placeholder="Introduce tu reseña aquí" />
        </div>
        <div>
          <button type="submit">Publicar</button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;

