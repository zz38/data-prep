package org.talend.dataprep.transformation.aggregation.api;

import static org.talend.dataprep.test.SameJSONFile.sameJSONAsFile;

import java.io.IOException;

import junit.framework.TestCase;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.talend.dataprep.transformation.Application;
import org.talend.dataprep.transformation.aggregation.operation.NumberContext;

/**
 * Unit test for the aggregation result json serialization.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
@IntegrationTest
public class AggregationResultTest extends TestCase {

    /** The data-prep ready jackson module. */
    @Autowired
    private Jackson2ObjectMapperBuilder builder;

    @Test
    public void shouldSerialize() throws IOException {

        // given
        AggregationResult result = new AggregationResult(Operator.MAX);
        result.put("toto", new NumberContext(123d));
        result.put("titi", new NumberContext(456d));
        result.put("tata", new NumberContext(789d));
        result.put("tutu", new NumberContext(753d));

        // when
        String actual = builder.build().writer().writeValueAsString(result);

        // then
        Assert.assertThat(actual, sameJSONAsFile(this.getClass().getResourceAsStream("aggregation_result.json")));
    }

}