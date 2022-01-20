import FIntersectionObserver from '@/components/FIntersectionObserver/FIntersectionObserver.vue';

export default {
    title: 'FIntersectionObserver',
    component: FIntersectionObserver,
};

export const Default = () => ({
    components: { FIntersectionObserver },
    template: `
        <div style="max-width: 400px; margin: 0 auto">
            <p style="position: fixed; left: 0; top: 0;">Intersecting: <b>{{ intersecting }}</b></p>
            <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid aut dolorum et inventore quidem unde, vitae? Aliquid, cupiditate error eveniet impedit iste maiores nemo porro provident quasi quod totam voluptate?</div><div>Asperiores consequatur culpa deserunt doloremque eius excepturi exercitationem iusto molestias, nihil officiis perferendis possimus, quo, sapiente sequi ut. Ad blanditiis consectetur ea exercitationem fugiat laborum maiores maxime, nostrum numquam! Molestias?</div><div>Ab alias, amet at deleniti fugit ipsa laboriosam laudantium libero maxime modi molestias natus nihil, odio officiis repudiandae sapiente sequi, sint suscipit vitae voluptatem! Assumenda consectetur eius eligendi nulla velit?</div><div>Architecto cum error provident quae repudiandae soluta vero. Ad aliquid asperiores assumenda distinctio dolor ex facere illum libero magni natus neque, officia officiis perspiciatis possimus quia sapiente veritatis vitae voluptate.</div>
            <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid aut dolorum et inventore quidem unde, vitae? Aliquid, cupiditate error eveniet impedit iste maiores nemo porro provident quasi quod totam voluptate?</div><div>Asperiores consequatur culpa deserunt doloremque eius excepturi exercitationem iusto molestias, nihil officiis perferendis possimus, quo, sapiente sequi ut. Ad blanditiis consectetur ea exercitationem fugiat laborum maiores maxime, nostrum numquam! Molestias?</div><div>Ab alias, amet at deleniti fugit ipsa laboriosam laudantium libero maxime modi molestias natus nihil, odio officiis repudiandae sapiente sequi, sint suscipit vitae voluptatem! Assumenda consectetur eius eligendi nulla velit?</div><div>Architecto cum error provident quae repudiandae soluta vero. Ad aliquid asperiores assumenda distinctio dolor ex facere illum libero magni natus neque, officia officiis perspiciatis possimus quia sapiente veritatis vitae voluptate.</div>

            <f-intersection-observer @entry="onEntry">
                <div style="width: 30px; height: 30px; background: tomato"></div>
            </f-intersection-observer>

            <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa cumque ipsum iusto voluptatum? Consectetur cumque cupiditate debitis dicta dolore enim exercitationem facilis fuga impedit, laboriosam laborum obcaecati odit praesentium reiciendis.</div><div>Ab commodi dolor, harum incidunt ipsa ipsam odio provident veniam? Eaque eum laudantium totam! A, aliquam aperiam, beatae, debitis delectus eaque fuga modi numquam perspiciatis possimus quo quos! Quasi, voluptate!</div><div>Ab aliquam autem corporis eligendi ex, harum incidunt libero maiores molestias necessitatibus neque perferendis possimus quae quasi repudiandae. Asperiores, deleniti dolores ipsam mollitia nulla omnis reprehenderit. Delectus dicta illo maiores?</div><div>At blanditiis delectus dolorem explicabo ipsum maiores officiis repellat. Alias aperiam architecto aut, consectetur deleniti earum ex exercitationem hic illum in labore laborum laudantium molestias quos recusandae tenetur voluptate! Distinctio.</div><div>A aliquam aliquid animi aspernatur aut autem dolores doloribus exercitationem explicabo facilis hic laboriosam laborum maiores minima necessitatibus nemo non omnis praesentium, rem suscipit temporibus voluptatem voluptates. Nesciunt, provident, vero?</div>
        </div>
    `,
    data() {
        return {
            intersecting: false,
        };
    },
    methods: {
        onEntry(_entry) {
            this.intersecting = _entry.isIntersecting;
        },
    },
});

export const Tag = () => ({
    components: { FIntersectionObserver },
    template: `
        <div style="max-width: 400px; margin: 0 auto">
            <p style="position: fixed; left: 0; top: 0;">Intersecting: <b>{{ intersecting }}</b></p>
            <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid aut dolorum et inventore quidem unde, vitae? Aliquid, cupiditate error eveniet impedit iste maiores nemo porro provident quasi quod totam voluptate?</div><div>Asperiores consequatur culpa deserunt doloremque eius excepturi exercitationem iusto molestias, nihil officiis perferendis possimus, quo, sapiente sequi ut. Ad blanditiis consectetur ea exercitationem fugiat laborum maiores maxime, nostrum numquam! Molestias?</div><div>Ab alias, amet at deleniti fugit ipsa laboriosam laudantium libero maxime modi molestias natus nihil, odio officiis repudiandae sapiente sequi, sint suscipit vitae voluptatem! Assumenda consectetur eius eligendi nulla velit?</div><div>Architecto cum error provident quae repudiandae soluta vero. Ad aliquid asperiores assumenda distinctio dolor ex facere illum libero magni natus neque, officia officiis perspiciatis possimus quia sapiente veritatis vitae voluptate.</div>
            <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid aut dolorum et inventore quidem unde, vitae? Aliquid, cupiditate error eveniet impedit iste maiores nemo porro provident quasi quod totam voluptate?</div><div>Asperiores consequatur culpa deserunt doloremque eius excepturi exercitationem iusto molestias, nihil officiis perferendis possimus, quo, sapiente sequi ut. Ad blanditiis consectetur ea exercitationem fugiat laborum maiores maxime, nostrum numquam! Molestias?</div><div>Ab alias, amet at deleniti fugit ipsa laboriosam laudantium libero maxime modi molestias natus nihil, odio officiis repudiandae sapiente sequi, sint suscipit vitae voluptatem! Assumenda consectetur eius eligendi nulla velit?</div><div>Architecto cum error provident quae repudiandae soluta vero. Ad aliquid asperiores assumenda distinctio dolor ex facere illum libero magni natus neque, officia officiis perspiciatis possimus quia sapiente veritatis vitae voluptate.</div>

            <f-intersection-observer tag="ul" @entry="onEntry">
                <li style="width: 30px; height: 30px; background: tomato">...</li>
            </f-intersection-observer>

            <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa cumque ipsum iusto voluptatum? Consectetur cumque cupiditate debitis dicta dolore enim exercitationem facilis fuga impedit, laboriosam laborum obcaecati odit praesentium reiciendis.</div><div>Ab commodi dolor, harum incidunt ipsa ipsam odio provident veniam? Eaque eum laudantium totam! A, aliquam aperiam, beatae, debitis delectus eaque fuga modi numquam perspiciatis possimus quo quos! Quasi, voluptate!</div><div>Ab aliquam autem corporis eligendi ex, harum incidunt libero maiores molestias necessitatibus neque perferendis possimus quae quasi repudiandae. Asperiores, deleniti dolores ipsam mollitia nulla omnis reprehenderit. Delectus dicta illo maiores?</div><div>At blanditiis delectus dolorem explicabo ipsum maiores officiis repellat. Alias aperiam architecto aut, consectetur deleniti earum ex exercitationem hic illum in labore laborum laudantium molestias quos recusandae tenetur voluptate! Distinctio.</div><div>A aliquam aliquid animi aspernatur aut autem dolores doloribus exercitationem explicabo facilis hic laboriosam laborum maiores minima necessitatibus nemo non omnis praesentium, rem suscipit temporibus voluptatem voluptates. Nesciunt, provident, vero?</div>
        </div>
    `,
    data() {
        return {
            intersecting: false,
        };
    },
    methods: {
        onEntry(_entry) {
            this.intersecting = _entry.isIntersecting;
        },
    },
});

export const Root = () => ({
    components: { FIntersectionObserver },
    template: `
        <div>
            <p>Intersecting: <b>{{ intersecting }}</b></p>
            <div id="fio_root" style="max-width: 400px; margin: 0 auto; height: 400px; overflow: auto">
                <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid aut dolorum et inventore quidem unde, vitae? Aliquid, cupiditate error eveniet impedit iste maiores nemo porro provident quasi quod totam voluptate?</div><div>Asperiores consequatur culpa deserunt doloremque eius excepturi exercitationem iusto molestias, nihil officiis perferendis possimus, quo, sapiente sequi ut. Ad blanditiis consectetur ea exercitationem fugiat laborum maiores maxime, nostrum numquam! Molestias?</div><div>Ab alias, amet at deleniti fugit ipsa laboriosam laudantium libero maxime modi molestias natus nihil, odio officiis repudiandae sapiente sequi, sint suscipit vitae voluptatem! Assumenda consectetur eius eligendi nulla velit?</div><div>Architecto cum error provident quae repudiandae soluta vero. Ad aliquid asperiores assumenda distinctio dolor ex facere illum libero magni natus neque, officia officiis perspiciatis possimus quia sapiente veritatis vitae voluptate.</div>

                <f-intersection-observer root="#fio_root" @entry="onEntry">
                    <div style="width: 30px; height: 30px; background: tomato"></div>
                </f-intersection-observer>

                <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa cumque ipsum iusto voluptatum? Consectetur cumque cupiditate debitis dicta dolore enim exercitationem facilis fuga impedit, laboriosam laborum obcaecati odit praesentium reiciendis.</div><div>Ab commodi dolor, harum incidunt ipsa ipsam odio provident veniam? Eaque eum laudantium totam! A, aliquam aperiam, beatae, debitis delectus eaque fuga modi numquam perspiciatis possimus quo quos! Quasi, voluptate!</div><div>Ab aliquam autem corporis eligendi ex, harum incidunt libero maiores molestias necessitatibus neque perferendis possimus quae quasi repudiandae. Asperiores, deleniti dolores ipsam mollitia nulla omnis reprehenderit. Delectus dicta illo maiores?</div><div>At blanditiis delectus dolorem explicabo ipsum maiores officiis repellat. Alias aperiam architecto aut, consectetur deleniti earum ex exercitationem hic illum in labore laborum laudantium molestias quos recusandae tenetur voluptate! Distinctio.</div><div>A aliquam aliquid animi aspernatur aut autem dolores doloribus exercitationem explicabo facilis hic laboriosam laborum maiores minima necessitatibus nemo non omnis praesentium, rem suscipit temporibus voluptatem voluptates. Nesciunt, provident, vero?</div>
            </div>
        </div>
    `,
    data() {
        return {
            intersecting: false,
        };
    },
    methods: {
        onEntry(_entry) {
            this.intersecting = _entry.isIntersecting;
        },
    },
});

export const rootMargin = () => ({
    components: { FIntersectionObserver },
    template: `
        <div>
            <p>Intersecting: <b>{{ intersecting }}</b></p>
            <div id="fio_root2" style="max-width: 400px; margin: 0 auto; height: 400px; overflow: auto">
                <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid aut dolorum et inventore quidem unde, vitae? Aliquid, cupiditate error eveniet impedit iste maiores nemo porro provident quasi quod totam voluptate?</div><div>Asperiores consequatur culpa deserunt doloremque eius excepturi exercitationem iusto molestias, nihil officiis perferendis possimus, quo, sapiente sequi ut. Ad blanditiis consectetur ea exercitationem fugiat laborum maiores maxime, nostrum numquam! Molestias?</div><div>Ab alias, amet at deleniti fugit ipsa laboriosam laudantium libero maxime modi molestias natus nihil, odio officiis repudiandae sapiente sequi, sint suscipit vitae voluptatem! Assumenda consectetur eius eligendi nulla velit?</div><div>Architecto cum error provident quae repudiandae soluta vero. Ad aliquid asperiores assumenda distinctio dolor ex facere illum libero magni natus neque, officia officiis perspiciatis possimus quia sapiente veritatis vitae voluptate.</div>

                <f-intersection-observer root-margin="50px 0px" root="#fio_root2" @entry="onEntry">
                    <div style="width: 30px; height: 30px; background: tomato"></div>
                </f-intersection-observer>

                <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa cumque ipsum iusto voluptatum? Consectetur cumque cupiditate debitis dicta dolore enim exercitationem facilis fuga impedit, laboriosam laborum obcaecati odit praesentium reiciendis.</div><div>Ab commodi dolor, harum incidunt ipsa ipsam odio provident veniam? Eaque eum laudantium totam! A, aliquam aperiam, beatae, debitis delectus eaque fuga modi numquam perspiciatis possimus quo quos! Quasi, voluptate!</div><div>Ab aliquam autem corporis eligendi ex, harum incidunt libero maiores molestias necessitatibus neque perferendis possimus quae quasi repudiandae. Asperiores, deleniti dolores ipsam mollitia nulla omnis reprehenderit. Delectus dicta illo maiores?</div><div>At blanditiis delectus dolorem explicabo ipsum maiores officiis repellat. Alias aperiam architecto aut, consectetur deleniti earum ex exercitationem hic illum in labore laborum laudantium molestias quos recusandae tenetur voluptate! Distinctio.</div><div>A aliquam aliquid animi aspernatur aut autem dolores doloribus exercitationem explicabo facilis hic laboriosam laborum maiores minima necessitatibus nemo non omnis praesentium, rem suscipit temporibus voluptatem voluptates. Nesciunt, provident, vero?</div>
            </div>
        </div>
    `,
    data() {
        return {
            intersecting: false,
        };
    },
    methods: {
        onEntry(_entry) {
            this.intersecting = _entry.isIntersecting;
        },
    },
});
