export default {
    wrapBegin:
        //"data = {\n" +
       // '  \'code\': import textwrap\ntextwrap.dedent("""\n' +
        '\n\n',
    mainSampleCodeBody:
        "\n",

    mainSampleCodeBody_old:
        "\n # Some code goes here which is not to be" +
        "\n # edited by the user of the web app\n\n" +
        "    import random\n" +
        "    NUM_SAMPLES = 100000\n" +
        "    def sample(p):\n" +
        "      x, y = random.random(), random.random()\n" +
        "      return 1 if x*x + y*y < 1 else 0\n" +
        "\n" +
        "    count = sc.parallelize(xrange(0, NUM_SAMPLES)).map(sample).reduce(lambda a, b: a + b)\n" +
        '    print "Pi is roughly %f" % (4.0 * count / NUM_SAMPLES)\n',
    wrapEnd: ""//'    """)\n' + "}"
}