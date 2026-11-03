export default function Testimonial() {
  return (
    <section className="border-t border-gray-800 bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-12 text-center lg:px-6 lg:py-20">
        <figure className="mx-auto max-w-screen-md">
          <svg
            className="mx-auto mb-4 h-10 text-vermilion-500"
            viewBox="0 0 24 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z"
              fill="currentColor"
            />
          </svg>
          <blockquote>
            <p className="font-display text-2xl font-medium leading-relaxed text-gray-50 md:text-3xl">
              "Koleksinya rapi dan pilihannya jujur. Setiap pesanan terasa
              seperti hadiah kecil untuk diri sendiri."
            </p>
          </blockquote>
          <figcaption className="mt-8 flex items-center justify-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold text-gray-900">
              R
            </span>
            <div className="flex items-center divide-x divide-gray-600">
              <div className="pr-3 font-medium text-gray-100">Rani Putri</div>
              <div className="pl-3 text-sm text-gray-400">Pembaca setia</div>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
